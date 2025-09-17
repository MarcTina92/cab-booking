<?php

namespace Drupal\cab_booking\Plugin\Block;

use Drupal\cab_booking\Service\CarTypeService;
use Drupal\Core\Block\BlockBase;
use Drupal\node\Entity\Node;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Plugin\ContainerFactoryPluginInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Provides a 'Cab Booking Form' block.
 *
 * @Block(
 *   id = "cab_booking_block",
 *   admin_label = @Translation("Cab Booking Block"),
 * )
 */
class CabBookingBlock extends BlockBase implements ContainerFactoryPluginInterface {

  protected $carTypeService;

  public function __construct(array $configuration, $plugin_id, $plugin_definition, CarTypeService $carTypeService) {
    parent::__construct($configuration, $plugin_id, $plugin_definition);
    $this->carTypeService = $carTypeService;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition) {
    return new static(
      $configuration,
      $plugin_id,
      $plugin_definition,
      $container->get('cab_booking.car_type_service')
    );
  }

  /**
   * {@inheritdoc}
   */
  public function build() {
    // Create a new node object of type 'booking' to pass to the form.
    $node = Node::create(['type' => 'booking']);
    $form = \Drupal::entityTypeManager()
      ->getFormObject('node', 'default')
      ->setEntity($node);

    $form_builder = \Drupal::service('form_builder');
    $rendered_form = $form_builder->getForm($form);
    // Load car types and their details.
    $carTypes = $this->carTypeService->getCarTypes();
    // Attach carTypes to DrupalSettings for JS access.
    $settings = [
      'cab_booking' => [
        'car_types' => $carTypes,
      ],
    ];

    return [
      '#theme' => 'cab_booking',
      '#booking_form' => $rendered_form,
      '#attached' => [
        'library' => [
          'cab_booking/price-calculator',
        ],
        'drupalSettings' => $settings,
      ],
    ];
  }
}

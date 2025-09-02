<?php

namespace Drupal\cab_booking\Plugin\Block;

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
class CabBookingBlock extends BlockBase {

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
    return [
      '#theme' => 'cab_booking',
      '#booking_form' => $rendered_form,
      '#attached' => [
        'library' => [
          'cab_booking/price-calculator',
        ],
      ]
    ];
  }
}

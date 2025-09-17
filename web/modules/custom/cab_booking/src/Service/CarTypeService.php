<?php

namespace Drupal\cab_booking\Service;

use Drupal\taxonomy\Entity\Term;
use Drupal\taxonomy\Entity\Vocabulary;
use Drupal\Core\Entity\EntityStorageInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

class CarTypeService {

  protected $entityTypeManager;

  public function __construct(EntityTypeManagerInterface $entity_type_manager) {
    $this->entityTypeManager = $entity_type_manager;
  }

  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('entity_type.manager')
    );
  }

  public function getCarTypes() {
    $carTypes = [];
    $termStorage = $this->entityTypeManager->getStorage('taxonomy_term');
    $terms = $termStorage->loadByProperties(['vid' => 'car_type']);

    foreach ($terms as $term) {
      if ($term instanceof Term) {
        $carTypes[$term->id()] = [
          'maximum_distance' => $term->get('field_maximum_distance')->value,
          'minimum_distance' => $term->get('field_minimum_distance')->value,
          'minimum_price' => $term->get('field_minimum_price')->value,
          'price_per_unit' => $term->get('field_price_per_unit')->value,
          'seat_capacity' => $term->get('field_seat_capacity')->value,
        ];
      }
    }

    return $carTypes;
  }
}

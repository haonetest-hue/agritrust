// Event type definitions and validation schemas

export const EVENT_TYPES = {
  PLANTING: "planting",
  HARVESTING: "harvesting",
  PROCESSING: "processing",
  QUALITY_CHECK: "quality_check",
  SHIPPING: "shipping",
  DELIVERY: "delivery",
  CERTIFICATION: "certification",
} as const

export const EVENT_SCHEMAS = {
  planting: {
    required: ["seedVariety", "plantingDate", "fieldLocation"],
    optional: ["soilConditions", "weatherConditions", "seedSource"],
  },
  harvesting: {
    required: ["harvestDate", "quantity", "unit"],
    optional: ["qualityGrade", "moistureContent", "harvestConditions"],
  },
  processing: {
    required: ["processType", "processDate", "inputQuantity", "outputQuantity"],
    optional: ["processingConditions", "qualityTests", "certifications"],
  },
  quality_check: {
    required: ["inspector", "inspectionDate", "qualityGrade"],
    optional: ["testResults", "certifications", "defects", "recommendations"],
  },
  shipping: {
    required: ["carrier", "shipmentDate", "origin", "destination"],
    optional: ["trackingNumber", "expectedDelivery", "shippingConditions"],
  },
  delivery: {
    required: ["deliveryDate", "recipient", "deliveryLocation"],
    optional: ["deliveryConditions", "receivedQuantity", "qualityAtDelivery"],
  },
  certification: {
    required: ["certificationType", "certifier", "certificationDate"],
    optional: ["validUntil", "certificationNumber", "standards"],
  },
}

export function validateEventMetadata(type: keyof typeof EVENT_SCHEMAS, metadata: Record<string, any>): boolean {
  const schema = EVENT_SCHEMAS[type]
  if (!schema) return false

  // Check required fields
  for (const field of schema.required) {
    if (!(field in metadata)) {
      return false
    }
  }

  return true
}

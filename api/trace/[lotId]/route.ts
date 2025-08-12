import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { lotId: string } }) {
  try {
    const { lotId } = params

    // Mock enhanced data - in production, fetch from multiple sources
    const enhancedTraceData = {
      lot: {
        id: lotId,
        productType: "Organic Coffee Beans",
        variety: "Arabica Premium",
        quantity: 500,
        harvestDate: "2024-01-15",
        nftTokenId: `0.0.${Math.floor(Math.random() * 1000000)}`,
      },
      farmer: {
        name: "Maria Santos",
        did: `did:hedera:testnet:${Math.random().toString(36).substring(7)}`,
        location: "Huehuetenango, Guatemala",
        reputation: 92,
        story:
          "Third-generation coffee farmer committed to sustainable practices and community development. Our family has been growing coffee for over 60 years using traditional methods combined with modern sustainability practices.",
        certifications: ["Organic", "Fair Trade", "Rainforest Alliance", "Bird Friendly"],
        farmSize: "5.2 hectares",
        experience: "25 years",
      },
      events: [
        {
          id: "evt_001",
          eventType: "planting",
          timestamp: "2023-04-01T08:00:00Z",
          location: "Farm Plot A-12, Huehuetenango",
          coordinates: { lat: 15.3173, lng: -91.4696 },
          description: "Coffee seedlings planted using organic methods",
          actor: "Maria Santos",
          weather: "Sunny, 22°C",
        },
        {
          id: "evt_002",
          eventType: "harvesting",
          timestamp: "2024-01-15T06:00:00Z",
          location: "Farm Plot A-12, Huehuetenango",
          coordinates: { lat: 15.3173, lng: -91.4696 },
          description: "Hand-picked ripe coffee cherries at optimal maturity",
          actor: "Maria Santos & Family",
          weather: "Clear, 18°C",
        },
        {
          id: "evt_003",
          eventType: "processing",
          timestamp: "2024-01-16T10:00:00Z",
          location: "Santos Family Processing Center",
          coordinates: { lat: 15.318, lng: -91.47 },
          description: "Wet processing method with 48-hour fermentation",
          actor: "Processing Team",
          qualityGrade: "AA",
        },
        {
          id: "evt_004",
          eventType: "quality_check",
          timestamp: "2024-01-20T14:00:00Z",
          location: "Guatemala Coffee Lab, Antigua",
          coordinates: { lat: 14.5586, lng: -90.7351 },
          description: "Quality assessment and cupping score evaluation",
          actor: "Certified Q Grader",
          cuppingScore: 87,
        },
        {
          id: "evt_005",
          eventType: "shipping",
          timestamp: "2024-01-25T09:00:00Z",
          location: "Puerto Quetzal, Guatemala",
          coordinates: { lat: 13.9319, lng: -90.7854 },
          description: "Shipped via sustainable transport to distribution center",
          actor: "Green Logistics Co.",
          transportMethod: "Carbon-neutral shipping",
        },
        {
          id: "evt_006",
          eventType: "delivery",
          timestamp: "2024-02-05T15:30:00Z",
          location: "Premium Coffee Roasters, San Francisco",
          coordinates: { lat: 37.7749, lng: -122.4194 },
          description: "Delivered to certified organic roastery",
          actor: "Final Mile Delivery",
          condition: "Perfect",
        },
      ],
      sustainability: {
        carbonFootprint: 2.3,
        carbonOffset: 3.1,
        waterUsage: 140,
        transportDistance: 4200,
        farmersSupported: 12,
        biodiversityScore: 8.5,
        soilHealthIndex: 9.2,
        renewableEnergyUsed: 85,
      },
      qualityTests: [
        { parameter: "Moisture Content", value: "11.2", unit: "%", status: "passed" },
        { parameter: "Defect Count", value: "2", unit: "per 300g", status: "passed" },
        { parameter: "Cupping Score", value: "87", unit: "points", status: "passed" },
        { parameter: "Acidity Level", value: "6.2", unit: "pH", status: "passed" },
        { parameter: "Pesticide Residue", value: "0", unit: "ppm", status: "passed" },
      ],
      certifications: [
        { name: "USDA Organic", issuer: "CCOF", expiryDate: "2024-12-31" },
        { name: "Fair Trade Certified", issuer: "Fair Trade USA", expiryDate: "2024-11-15" },
        { name: "Rainforest Alliance", issuer: "RA", expiryDate: "2025-03-20" },
        { name: "Bird Friendly", issuer: "Smithsonian", expiryDate: "2024-10-10" },
      ],
      blockchain: {
        hcsTopicId: process.env.HEDERA_TOPIC_ID,
        consensusTimestamp: "2024-02-05T15:30:45.123456Z",
        transactionId: `0.0.${Math.floor(Math.random() * 1000000)}@${Date.now()}`,
        verified: true,
      },
    }

    return NextResponse.json(enhancedTraceData)
  } catch (error) {
    console.error("Error fetching enhanced trace data:", error)
    return NextResponse.json({ error: "Failed to fetch trace data" }, { status: 500 })
  }
}

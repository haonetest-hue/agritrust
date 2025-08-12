"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { AlertCircle, CheckCircle, Clock, FileText, Microscope, Award } from "lucide-react"

interface QualityTest {
  id: string
  lotId: string
  farmerName: string
  crop: string
  testType: string
  status: "pending" | "in_progress" | "completed" | "rejected"
  requestDate: string
  completionDate?: string
  priority: "low" | "medium" | "high"
  overallGrade?: number
}

interface TestResult {
  parameter: string
  value: string
  unit: string
  passThreshold: string
  status: "pass" | "fail" | "warning"
}

export default function LabDashboardPage() {
  const [tests, setTests] = useState<QualityTest[]>([])
  const [selectedTest, setSelectedTest] = useState<QualityTest | null>(null)
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form states for new test result
  const [overallGrade, setOverallGrade] = useState("")
  const [overallStatus, setOverallStatus] = useState("")
  const [methodology, setMethodology] = useState("")
  const [technician, setTechnician] = useState("")
  const [notes, setNotes] = useState("")

  useEffect(() => {
    // Mock data - in production, fetch from API
    const mockTests: QualityTest[] = [
      {
        id: "TEST-001",
        lotId: "LOT-001",
        farmerName: "Budi Santoso",
        crop: "Coffee",
        testType: "moisture",
        status: "pending",
        requestDate: "2025-01-15",
        priority: "high",
      },
      {
        id: "TEST-002",
        lotId: "LOT-002",
        farmerName: "Sari Dewi",
        crop: "Cocoa",
        testType: "grading",
        status: "in_progress",
        requestDate: "2025-01-14",
        priority: "medium",
      },
      {
        id: "TEST-003",
        lotId: "LOT-003",
        farmerName: "Ahmad Rizki",
        crop: "Rice",
        testType: "contamination",
        status: "completed",
        requestDate: "2025-01-12",
        completionDate: "2025-01-13",
        priority: "low",
        overallGrade: 88,
      },
    ]
    setTests(mockTests)

    // Mock test results
    setTestResults([
      { parameter: "Moisture Content", value: "12.5", unit: "%", passThreshold: "≤ 14%", status: "pass" },
      { parameter: "Defect Rate", value: "3.2", unit: "%", passThreshold: "≤ 5%", status: "pass" },
      { parameter: "Foreign Matter", value: "0.8", unit: "%", passThreshold: "≤ 1%", status: "pass" },
      { parameter: "Insect Damage", value: "1.5", unit: "%", passThreshold: "≤ 2%", status: "pass" },
    ])
  }, [])

  const handleSubmitTestResult = async () => {
    if (!selectedTest || !overallGrade || !overallStatus) return

    setIsSubmitting(true)
    try {
      const testResultData = {
        lotId: selectedTest.lotId,
        testId: selectedTest.id,
        testType: selectedTest.testType,
        results: testResults,
        overallGrade: Number.parseFloat(overallGrade),
        overallStatus,
        methodology,
        technician,
        notes,
        testDate: new Date().toISOString(),
      }

      // In production, call API to submit test result
      const response = await fetch("/api/lab/attestations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testResultData),
      })

      if (response.ok) {
        // Update test status
        setTests(
          tests.map((test) =>
            test.id === selectedTest.id
              ? {
                  ...test,
                  status: "completed",
                  completionDate: new Date().toISOString().split("T")[0],
                  overallGrade: Number.parseFloat(overallGrade),
                }
              : test,
          ),
        )
        setSelectedTest(null)
        // Reset form
        setOverallGrade("")
        setOverallStatus("")
        setMethodology("")
        setTechnician("")
        setNotes("")
      }
    } catch (error) {
      console.error("Error submitting test result:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />
      case "in_progress":
        return <Microscope className="w-4 h-4 text-blue-500" />
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "rejected":
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return null
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Lab Quality Dashboard</h1>
          <p className="text-muted-foreground">Manage quality tests and issue attestations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Reports
          </Button>
          <Button>
            <Award className="w-4 h-4 mr-2" />
            Certificates
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Tests</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tests.filter((t) => t.status === "pending").length}</div>
            <p className="text-xs text-muted-foreground">Awaiting processing</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Microscope className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tests.filter((t) => t.status === "in_progress").length}</div>
            <p className="text-xs text-muted-foreground">Currently testing</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Tests completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Grade</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87.2</div>
            <p className="text-xs text-muted-foreground">Quality score</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="tests" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tests">Quality Tests</TabsTrigger>
          <TabsTrigger value="attestations">Attestations</TabsTrigger>
          <TabsTrigger value="certificates">Certificates</TabsTrigger>
        </TabsList>

        <TabsContent value="tests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quality Tests Queue</CardTitle>
              <CardDescription>Manage incoming quality test requests</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Test ID</TableHead>
                    <TableHead>Lot ID</TableHead>
                    <TableHead>Farmer</TableHead>
                    <TableHead>Crop</TableHead>
                    <TableHead>Test Type</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tests.map((test) => (
                    <TableRow key={test.id}>
                      <TableCell className="font-medium">{test.id}</TableCell>
                      <TableCell>{test.lotId}</TableCell>
                      <TableCell>{test.farmerName}</TableCell>
                      <TableCell>{test.crop}</TableCell>
                      <TableCell className="capitalize">{test.testType.replace("_", " ")}</TableCell>
                      <TableCell>
                        <Badge variant={getPriorityColor(test.priority) as any}>{test.priority.toUpperCase()}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(test.status)}
                          <span className="capitalize">{test.status.replace("_", " ")}</span>
                        </div>
                      </TableCell>
                      <TableCell>{test.overallGrade ? `${test.overallGrade}/100` : "-"}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {test.status === "pending" && (
                            <Button
                              size="sm"
                              onClick={() => {
                                setTests(tests.map((t) => (t.id === test.id ? { ...t, status: "in_progress" } : t)))
                              }}
                            >
                              Start Test
                            </Button>
                          )}
                          {test.status === "in_progress" && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" onClick={() => setSelectedTest(test)}>
                                  Submit Results
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Submit Test Results - {test.id}</DialogTitle>
                                  <DialogDescription>
                                    Enter quality test results for {test.crop} from {test.farmerName}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  {/* Test Results Table */}
                                  <div>
                                    <Label className="text-base font-medium">Test Parameters</Label>
                                    <Table>
                                      <TableHeader>
                                        <TableRow>
                                          <TableHead>Parameter</TableHead>
                                          <TableHead>Value</TableHead>
                                          <TableHead>Threshold</TableHead>
                                          <TableHead>Status</TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {testResults.map((result, index) => (
                                          <TableRow key={index}>
                                            <TableCell>{result.parameter}</TableCell>
                                            <TableCell>
                                              {result.value} {result.unit}
                                            </TableCell>
                                            <TableCell>{result.passThreshold}</TableCell>
                                            <TableCell>
                                              <Badge variant={result.status === "pass" ? "default" : "destructive"}>
                                                {result.status.toUpperCase()}
                                              </Badge>
                                            </TableCell>
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                  </div>

                                  {/* Overall Assessment */}
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label htmlFor="overallGrade">Overall Grade (0-100)</Label>
                                      <Input
                                        id="overallGrade"
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={overallGrade}
                                        onChange={(e) => setOverallGrade(e.target.value)}
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="overallStatus">Overall Status</Label>
                                      <Select value={overallStatus} onValueChange={setOverallStatus}>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="approved">Approved</SelectItem>
                                          <SelectItem value="rejected">Rejected</SelectItem>
                                          <SelectItem value="conditional">Conditional</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>

                                  {/* Additional Information */}
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label htmlFor="methodology">Test Methodology</Label>
                                      <Input
                                        id="methodology"
                                        value={methodology}
                                        onChange={(e) => setMethodology(e.target.value)}
                                        placeholder="e.g., AOAC 925.10"
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="technician">Technician</Label>
                                      <Input
                                        id="technician"
                                        value={technician}
                                        onChange={(e) => setTechnician(e.target.value)}
                                        placeholder="Technician name"
                                      />
                                    </div>
                                  </div>

                                  <div>
                                    <Label htmlFor="notes">Notes</Label>
                                    <Textarea
                                      id="notes"
                                      value={notes}
                                      onChange={(e) => setNotes(e.target.value)}
                                      placeholder="Additional observations or comments"
                                    />
                                  </div>

                                  <div className="flex justify-end gap-2">
                                    <Button variant="outline" onClick={() => setSelectedTest(null)}>
                                      Cancel
                                    </Button>
                                    <Button onClick={handleSubmitTestResult} disabled={isSubmitting}>
                                      {isSubmitting ? "Submitting..." : "Submit & Issue Attestation"}
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          )}
                          {test.status === "completed" && (
                            <Button size="sm" variant="outline">
                              View Certificate
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attestations">
          <Card>
            <CardHeader>
              <CardTitle>Issued Attestations</CardTitle>
              <CardDescription>View and manage issued quality attestations</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-8">No attestations issued yet</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="certificates">
          <Card>
            <CardHeader>
              <CardTitle>Quality Certificates</CardTitle>
              <CardDescription>Manage quality certificates and verifiable credentials</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-8">No certificates available</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

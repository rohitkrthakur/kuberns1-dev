"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Plus,
  Github,
  Bell,
  ChevronDown,
  Edit3,
  Trash2,
  ExternalLink,
  Loader2,
  CheckCircle,
  XCircle,
} from "lucide-react"

interface EnvVariable {
  key: string
  value: string
}

interface FormData {
  organization: string
  repository: string
  branch: string
  appName: string
  region: string
  framework: string
  planType: string
  databaseEnabled: boolean
  port: string
  portType: "random" | "custom"
  envVariables: EnvVariable[]
}

interface ApiResponse {
  id?: number
  message?: string
  error?: string
}

export default function Component() {
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [statusMessage, setStatusMessage] = useState("")

  const [formData, setFormData] = useState<FormData>({
    organization: "Admin Naresh T",
    repository: "Kuberns Repo",
    branch: "Admin Naresh T",
    appName: "CloudCity",
    region: "us-michigan",
    framework: "vue",
    planType: "starter",
    databaseEnabled: false,
    port: "3000",
    portType: "random",
    envVariables: [
      { key: "API_URL", value: "https://api.example.com" },
      { key: "NODE_ENV", value: "production" },
      { key: "DATABASE_URL", value: "postgresql://localhost:5432/mydb" },
      { key: "JWT_SECRET", value: "your-secret-key" },
      { key: "API_KEY", value: "Secret Value" },
    ],
  })

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const addEnvVariable = () => {
    setFormData((prev) => ({
      ...prev,
      envVariables: [...prev.envVariables, { key: "", value: "" }],
    }))
  }

  const removeEnvVariable = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      envVariables: prev.envVariables.filter((_, i) => i !== index),
    }))
  }

  const updateEnvVariable = (index: number, field: "key" | "value", value: string) => {
    setFormData((prev) => ({
      ...prev,
      envVariables: prev.envVariables.map((env, i) => (i === index ? { ...env, [field]: value } : env)),
    }))
  }

  const generateRandomPort = () => {
    const port = Math.floor(Math.random() * (9999 - 3000) + 3000).toString()
    handleInputChange("port", port)
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    setSubmitStatus("idle")
    setStatusMessage("")

    try {
      // Filter out empty environment variables
      const filteredEnvVars = formData.envVariables
        .filter((env) => env.key.trim() !== "" && env.value.trim() !== "")
        .reduce(
          (acc, env) => {
            acc[env.key] = env.value
            return acc
          },
          {} as Record<string, string>,
        )

const payload = {
  name: formData.appName,
  owner: "current-user",
  region: formData.region,
  template: formData.framework,
  plan: formData.planType,
  repository: formData.repository,
  branch: formData.branch,
  environments: [
    {
      port: Number.parseInt(formData.port),
      env_vars: filteredEnvVars,
    },
  ],
}


      console.log("Submitting payload:", payload)

      const response = await fetch("http://localhost:8000/api/webapps/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const data: ApiResponse = await response.json()

      if (response.ok) {
        setSubmitStatus("success")
        setStatusMessage(`WebApp "${formData.appName}" created successfully! ID: ${data.id}`)
        console.log("Success:", data)
      } else {
        setSubmitStatus("error")
        setStatusMessage(data.error || "Failed to create WebApp")
        console.error("Error:", data)
      }
    } catch (error) {
      setSubmitStatus("error")
      setStatusMessage("Network error: Unable to connect to the server")
      console.error("Network error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setCurrentPage(1)
    setSubmitStatus("idle")
    setStatusMessage("")
    setFormData({
      organization: "Admin Naresh T",
      repository: "Kuberns Repo",
      branch: "Admin Naresh T",
      appName: "",
      region: "",
      framework: "",
      planType: "",
      databaseEnabled: false,
      port: "3000",
      portType: "random",
      envVariables: [{ key: "", value: "" }],
    })
  }

  if (currentPage === 1) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        {/* Header */}
        <header className="border-b border-gray-800 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="text-blue-400 font-semibold text-lg">Kuberns</div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span className="text-sm">Projects</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gray-600 rounded"></div>
                  <span className="text-sm text-gray-400">Datastore</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Quick Search"
                  className="bg-gray-800 border border-gray-700 rounded-md pl-10 pr-4 py-2 text-sm w-64 focus:outline-none focus:border-blue-500"
                />
              </div>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add New
              </Button>
              <Bell className="w-5 h-5 text-gray-400" />
              <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span>Documentation</span>
              <span>Support</span>
            </div>
          </div>
        </header>

        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-semibold mb-2">Create New App</h1>
              <p className="text-gray-400">
                Connect your repository and fill in the requirements to see the app deployed in seconds.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                  1
                </div>
                <div className="w-12 border-t border-dashed border-gray-600"></div>
                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-sm font-semibold text-gray-400">
                  2
                </div>
              </div>
            </div>
          </div>

          {/* Choose Version Control System */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium">Choose your Version Control System</h2>
              <div className="text-sm text-gray-400">
                Need Help? <span className="text-blue-400 cursor-pointer">Click here to learn more</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <Card className="bg-gray-800 border-gray-700 cursor-pointer hover:border-blue-500 transition-colors">
                <CardContent className="p-4 text-center">
                  <Github className="w-8 h-8 mx-auto mb-2 text-white" />
                  <div className="text-sm font-medium">GitHub</div>
                  <div className="text-xs text-gray-400">Source Control</div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700 cursor-pointer">
                <CardContent className="p-4 text-center">
                  <div className="w-8 h-8 mx-auto mb-2 bg-orange-500 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">G</span>
                  </div>
                  <div className="text-sm font-medium">GitLab</div>
                  <div className="text-xs text-gray-400">Self-Hosted Git</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div>
                <Label className="text-sm text-gray-300 mb-2 block">Select Organization</Label>
                <Select
                  value={formData.organization}
                  onValueChange={(value) => handleInputChange("organization", value)}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="Admin Naresh T">Admin Naresh T</SelectItem>
                    <SelectItem value="Company Org">Company Org</SelectItem>
                    <SelectItem value="Personal">Personal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm text-gray-300 mb-2 block">Select Repository</Label>
                <Select value={formData.repository} onValueChange={(value) => handleInputChange("repository", value)}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="Kuberns Repo">Kuberns Repo</SelectItem>
                    <SelectItem value="Frontend App">Frontend App</SelectItem>
                    <SelectItem value="Backend API">Backend API</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm text-gray-300 mb-2 block">Select Branch</Label>
                <Select value={formData.branch} onValueChange={(value) => handleInputChange("branch", value)}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="Admin Naresh T">main</SelectItem>
                    <SelectItem value="develop">develop</SelectItem>
                    <SelectItem value="staging">staging</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Configure GitHub
                </Button>
              </div>
            </div>
          </div>

          {/* Fill in the details */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium">Fill in the details of your App</h2>
              <div className="text-sm text-gray-400">
                Need Help? <span className="text-blue-400 cursor-pointer">Click here to learn more</span>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-base font-medium mb-2">Basic Details</h3>
              <p className="text-sm text-gray-400 mb-4">
                Enter the basic details of your application such as the name, region of deployment and the framework or
                the template for your application.
              </p>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm text-gray-300 mb-2 block">Choose a name *</Label>
                  <Input
                    value={formData.appName}
                    onChange={(e) => handleInputChange("appName", e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="CloudCity"
                    required
                  />
                </div>

                <div>
                  <Label className="text-sm text-gray-300 mb-2 block">Choose Region *</Label>
                  <Select value={formData.region} onValueChange={(value) => handleInputChange("region", value)}>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="us-east-1">US East (N. Virginia)</SelectItem>
                      <SelectItem value="us-west-2">US West (Oregon)</SelectItem>
                      <SelectItem value="us-michigan">United States - Michigan</SelectItem>
                      <SelectItem value="eu-west-1">Europe (Ireland)</SelectItem>
                      <SelectItem value="ap-southeast-1">Asia Pacific (Singapore)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm text-gray-300 mb-2 block">Choose Template *</Label>
                  <Select value={formData.framework} onValueChange={(value) => handleInputChange("framework", value)}>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="Select framework" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="react">React</SelectItem>
                      <SelectItem value="vue">Vue.js</SelectItem>
                      <SelectItem value="angular">Angular</SelectItem>
                      <SelectItem value="nextjs">Next.js</SelectItem>
                      <SelectItem value="nuxtjs">Nuxt.js</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Plan Type */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-medium">Plan Type *</h3>
                  <p className="text-sm text-gray-400">
                    Select the plan type that best suits your application's needs. Each plan offers different features,
                    resources, and limitations. Choose the plan that aligns with your requirements and budget.
                  </p>
                </div>
                <Button variant="link" className="text-blue-400 text-sm">
                  Upgrade Plan
                </Button>
              </div>

              <div className="bg-gray-800 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left p-4 text-sm font-medium text-gray-300">Plan type</th>
                      <th className="text-left p-4 text-sm font-medium text-gray-300">Storage</th>
                      <th className="text-left p-4 text-sm font-medium text-gray-300">Bandwidth</th>
                      <th className="text-left p-4 text-sm font-medium text-gray-300">Memory (RAM)</th>
                      <th className="text-left p-4 text-sm font-medium text-gray-300">CPU</th>
                      <th className="text-left p-4 text-sm font-medium text-gray-300">Monthly Cost</th>
                      <th className="text-left p-4 text-sm font-medium text-gray-300">Price per hour</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      className={`border-b border-gray-700 cursor-pointer hover:bg-gray-750 ${
                        formData.planType === "starter" ? "bg-gray-750" : ""
                      }`}
                      onClick={() => handleInputChange("planType", "starter")}
                    >
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="planType"
                            value="starter"
                            checked={formData.planType === "starter"}
                            onChange={(e) => handleInputChange("planType", e.target.value)}
                            className="text-blue-600"
                          />
                          <Badge variant="secondary" className="bg-green-900 text-green-300 border-green-700">
                            Starter
                          </Badge>
                        </div>
                      </td>
                      <td className="p-4 text-sm">10 GB</td>
                      <td className="p-4 text-sm">10 GB</td>
                      <td className="p-4 text-sm">512 MB</td>
                      <td className="p-4 text-sm">0.5 vCPU</td>
                      <td className="p-4 text-sm">₹0</td>
                      <td className="p-4 text-sm">₹0</td>
                    </tr>
                    <tr
                      className={`border-b border-gray-700 cursor-pointer hover:bg-gray-750 ${
                        formData.planType === "pro" ? "bg-gray-750" : ""
                      }`}
                      onClick={() => handleInputChange("planType", "pro")}
                    >
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="planType"
                            value="pro"
                            checked={formData.planType === "pro"}
                            onChange={(e) => handleInputChange("planType", e.target.value)}
                            className="text-blue-600"
                          />
                          <Badge variant="secondary" className="bg-blue-900 text-blue-300 border-blue-700">
                            Pro
                          </Badge>
                        </div>
                      </td>
                      <td className="p-4 text-sm">100 GB</td>
                      <td className="p-4 text-sm">500 GB</td>
                      <td className="p-4 text-sm">2 GB</td>
                      <td className="p-4 text-sm">1 vCPU</td>
                      <td className="p-4 text-sm">₹999</td>
                      <td className="p-4 text-sm">₹1.5</td>
                    </tr>
                  </tbody>
                </table>
                <div className="p-4 text-xs text-gray-400">*Ideal for personal blogs and small websites</div>
              </div>
            </div>

            {/* Database Selection */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-medium">Database Selection</h3>
                <div className="text-sm text-gray-400">
                  Need Help? <span className="text-blue-400 cursor-pointer">Click here to learn more</span>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-6">
                <p className="text-sm text-gray-300 mb-6">
                  Please be informed that the proper functioning of our application is dependent on a valid database
                  connection during deployment. Failing to establish a correct database connection will result in an
                  inability to access or manipulate essential data, rendering the application non-functional. It is
                  crucial to ensure a reliable database connection to guarantee the app's seamless operation.
                </p>

                <div className="flex space-x-4">
                  <Button
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => handleInputChange("databaseEnabled", true)}
                  >
                    Connect Database
                  </Button>
                  <Button
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                    onClick={() => handleInputChange("databaseEnabled", false)}
                  >
                    Maybe Later
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={() => setCurrentPage(2)}
                className="bg-blue-600 hover:bg-blue-700"
                disabled={!formData.appName || !formData.region || !formData.framework || !formData.planType}
              >
                Set Up Env Variables
                <ChevronDown className="w-4 h-4 ml-2 rotate-[-90deg]" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="text-blue-400 font-semibold text-lg">Kuberns</div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span className="text-sm">Projects</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gray-600 rounded"></div>
                <span className="text-sm text-gray-400">Datastore</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Quick Search"
                className="bg-gray-800 border border-gray-700 rounded-md pl-10 pr-4 py-2 text-sm w-64 focus:outline-none focus:border-blue-500"
              />
            </div>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add New
            </Button>
            <Bell className="w-5 h-5 text-gray-400" />
            <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
          </div>

          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <span>Documentation</span>
            <span>Support</span>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold mb-2">Create New App</h1>
            <p className="text-gray-400">
              Connect your repository and fill in the requirements to see the app deployed in seconds.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-sm font-semibold text-gray-400">
                1
              </div>
              <div className="w-12 border-t border-dashed border-gray-600"></div>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                2
              </div>
            </div>
          </div>
        </div>

        {/* Status Messages */}
        {submitStatus !== "idle" && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center space-x-2 ${
              submitStatus === "success" ? "bg-green-900 border border-green-700" : "bg-red-900 border border-red-700"
            }`}
          >
            {submitStatus === "success" ? (
              <CheckCircle className="w-5 h-5 text-green-400" />
            ) : (
              <XCircle className="w-5 h-5 text-red-400" />
            )}
            <span className={submitStatus === "success" ? "text-green-300" : "text-red-300"}>{statusMessage}</span>
            {submitStatus === "success" && (
              <Button
                size="sm"
                variant="outline"
                className="ml-auto border-green-600 text-green-300 hover:bg-green-800 bg-transparent"
                onClick={resetForm}
              >
                Create Another App
              </Button>
            )}
          </div>
        )}

        {/* Port Configuration */}
        <div className="mb-8">
          <h2 className="text-lg font-medium mb-4">Port Configuration</h2>
          <p className="text-sm text-gray-400 mb-6">
            Configure the port settings for your application, or we'll take care of it and assign one for you
            automatically.
          </p>

          <div className="flex items-center space-x-6 mb-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="portType"
                value="random"
                checked={formData.portType === "random"}
                onChange={(e) => handleInputChange("portType", e.target.value as "random" | "custom")}
                className="text-blue-600"
              />
              <span className="text-sm">Assign a random port</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="portType"
                value="custom"
                checked={formData.portType === "custom"}
                onChange={(e) => handleInputChange("portType", e.target.value as "random" | "custom")}
                className="text-blue-600"
              />
              <span className="text-sm">Set a Custom Port</span>
            </label>
          </div>

          <div className="flex items-center space-x-4">
            <Input
              value={formData.port}
              onChange={(e) => handleInputChange("port", e.target.value)}
              className="bg-gray-800 border-gray-700 text-white w-48"
              placeholder="3000"
              disabled={formData.portType === "random"}
            />
            {formData.portType === "random" && (
              <Button
                onClick={generateRandomPort}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
              >
                Generate Random Port
              </Button>
            )}
            <Badge variant="secondary" className="bg-green-900 text-green-300 border-green-700">
              {formData.portType === "random" ? "Random Port Assigned" : "Custom Port Set"}
            </Badge>
          </div>
        </div>

        {/* Configure Environment Variables */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">Configure Environment Variables</h2>
            <div className="text-sm text-gray-400">
              Need Help? <span className="text-blue-400 cursor-pointer">Click here to learn more</span>
            </div>
          </div>

          <p className="text-sm text-gray-400 mb-6">
            Manage and configure environment variables for your application. Environment variables are key-value pairs
            that allow you to configure settings, API endpoints, and connection information specific to each
            environment. Add, edit, or delete variables to tailor your application's behavior and integration with
            external services.
          </p>

          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left p-4 text-sm font-medium text-gray-300">Key</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-300">Value</th>
                  <th className="text-right p-4 text-sm font-medium text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {formData.envVariables.map((env, index) => (
                  <tr key={index} className="border-b border-gray-700">
                    <td className="p-4">
                      <Input
                        value={env.key}
                        onChange={(e) => updateEnvVariable(index, "key", e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white text-sm"
                        placeholder="ENV_KEY"
                      />
                    </td>
                    <td className="p-4">
                      <Input
                        value={env.value}
                        onChange={(e) => updateEnvVariable(index, "value", e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white text-sm"
                        placeholder="Environment value"
                        type={
                          env.key.toLowerCase().includes("secret") || env.key.toLowerCase().includes("password")
                            ? "password"
                            : "text"
                        }
                      />
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-blue-400 hover:text-blue-300 hover:bg-gray-700"
                        >
                          <Edit3 className="w-4 h-4" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-400 hover:text-red-300 hover:bg-gray-700"
                          onClick={() => removeEnvVariable(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="p-4 border-t border-gray-700">
              <Button onClick={addEnvVariable} className="bg-blue-600 hover:bg-blue-700">
                Add New
              </Button>
            </div>
          </div>
        </div>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(1)}
            className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
            disabled={isLoading}
          >
            Back to Step 1
          </Button>

          <Button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700"
            disabled={isLoading || !formData.appName || !formData.region || !formData.framework || !formData.planType}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating App...
              </>
            ) : (
              <>
                Finish my Setup
                <ChevronDown className="w-4 h-4 ml-2 rotate-[-90deg]" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

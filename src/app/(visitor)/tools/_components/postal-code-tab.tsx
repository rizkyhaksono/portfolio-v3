"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Search, Loader2 } from "lucide-react"

export function PostalCodeTab() {
  const [provinces, setProvinces] = useState<any[]>([])
  const [cities, setCities] = useState<any[]>([])
  const [districts, setDistricts] = useState<any[]>([])
  const [villages, setVillages] = useState<any[]>([])

  const [selectedProvince, setSelectedProvince] = useState("")
  const [selectedCity, setSelectedCity] = useState("")
  const [selectedDistrict, setSelectedDistrict] = useState("")
  const [selectedVillage, setSelectedVillage] = useState("")

  const [postalCode, setPostalCode] = useState("")
  const [searchCode, setSearchCode] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])

  const [loading, setLoading] = useState({
    provinces: false,
    cities: false,
    districts: false,
    villages: false,
    search: false,
  })

  // Fetch provinces on mount
  useEffect(() => {
    fetchProvinces()
  }, [])

  const fetchProvinces = async () => {
    setLoading((prev) => ({ ...prev, provinces: true }))
    try {
      const { getProvinces } = await import("@/services/visitor/postal-code")
      const response = await getProvinces()
      setProvinces(response.data || [])
    } catch (error) {
      console.error("Failed to fetch provinces:", error)
    } finally {
      setLoading((prev) => ({ ...prev, provinces: false }))
    }
  }

  const fetchCities = async (provinceId: string) => {
    setLoading((prev) => ({ ...prev, cities: true }))
    try {
      const { getCities } = await import("@/services/visitor/postal-code")
      const response = await getCities(provinceId)
      setCities(response.data || [])
    } catch (error) {
      console.error("Failed to fetch cities:", error)
    } finally {
      setLoading((prev) => ({ ...prev, cities: false }))
    }
  }

  const fetchDistricts = async (cityId: string) => {
    setLoading((prev) => ({ ...prev, districts: true }))
    try {
      const { getDistricts } = await import("@/services/visitor/postal-code")
      const response = await getDistricts(cityId)
      setDistricts(response.data || [])
    } catch (error) {
      console.error("Failed to fetch districts:", error)
    } finally {
      setLoading((prev) => ({ ...prev, districts: false }))
    }
  }

  const fetchVillages = async (districtId: string) => {
    setLoading((prev) => ({ ...prev, villages: true }))
    try {
      const { getVillages } = await import("@/services/visitor/postal-code")
      const response = await getVillages(districtId)
      setVillages(response.data || [])
    } catch (error) {
      console.error("Failed to fetch villages:", error)
    } finally {
      setLoading((prev) => ({ ...prev, villages: false }))
    }
  }

  const handleProvinceChange = (value: string) => {
    setSelectedProvince(value)
    setSelectedCity("")
    setSelectedDistrict("")
    setSelectedVillage("")
    setPostalCode("")
    setCities([])
    setDistricts([])
    setVillages([])
    fetchCities(value)
  }

  const handleCityChange = (value: string) => {
    setSelectedCity(value)
    setSelectedDistrict("")
    setSelectedVillage("")
    setPostalCode("")
    setDistricts([])
    setVillages([])
    fetchDistricts(value)
  }

  const handleDistrictChange = (value: string) => {
    setSelectedDistrict(value)
    setSelectedVillage("")
    setPostalCode("")
    setVillages([])
    fetchVillages(value)
  }

  const handleVillageChange = async (value: string) => {
    setSelectedVillage(value)
    // Search using village code to get postal code
    setLoading((prev) => ({ ...prev, search: true }))
    try {
      const { searchPostalCode } = await import("@/services/visitor/postal-code")
      const response = await searchPostalCode(value)
      if (response.data.data && response.data.data.length > 0) {
        setPostalCode(response.data.data[0].postal.toString())
      }
    } catch (error) {
      console.error("Failed to fetch postal code:", error)
    } finally {
      setLoading((prev) => ({ ...prev, search: false }))
    }
  }

  const handleSearchPostalCode = async () => {
    if (!searchCode.trim()) return

    setLoading((prev) => ({ ...prev, search: true }))
    try {
      const { searchPostalCode } = await import("@/services/visitor/postal-code")
      const response = await searchPostalCode(searchCode.trim())
      setSearchResults(response.data.data || [])
    } catch (error) {
      console.error("Failed to search postal code:", error)
      setSearchResults([])
    } finally {
      setLoading((prev) => ({ ...prev, search: false }))
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Find by Location</CardTitle>
          <CardDescription>Select province, city, district, and village to get postal code</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Province</label>
              <Select value={selectedProvince} onValueChange={handleProvinceChange} disabled={loading.provinces}>
                <SelectTrigger>
                  <SelectValue placeholder={loading.provinces ? "Loading..." : "Select province"} />
                </SelectTrigger>
                <SelectContent>
                  {provinces.map((province) => (
                    <SelectItem key={province.code} value={province.code}>
                      {province.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* City */}
            <div className="space-y-2">
              <label className="text-sm font-medium">City/Regency</label>
              <Select value={selectedCity} onValueChange={handleCityChange} disabled={!selectedProvince || loading.cities}>
                <SelectTrigger>
                  <SelectValue placeholder={loading.cities ? "Loading..." : "Select city"} />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city.code} value={city.code}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* District */}
            <div className="space-y-2">
              <label className="text-sm font-medium">District</label>
              <Select value={selectedDistrict} onValueChange={handleDistrictChange} disabled={!selectedCity || loading.districts}>
                <SelectTrigger>
                  <SelectValue placeholder={loading.districts ? "Loading..." : "Select district"} />
                </SelectTrigger>
                <SelectContent>
                  {districts.map((district) => (
                    <SelectItem key={district.code} value={district.code}>
                      {district.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Village */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Village</label>
              <Select value={selectedVillage} onValueChange={handleVillageChange} disabled={!selectedDistrict || loading.villages}>
                <SelectTrigger>
                  <SelectValue placeholder={loading.villages ? "Loading..." : "Select village"} />
                </SelectTrigger>
                <SelectContent>
                  {villages.map((village) => (
                    <SelectItem key={village.code} value={village.code}>
                      {village.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Postal Code Result */}
          {postalCode && (
            <div className="mt-6 p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Postal Code</p>
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{postalCode}</p>
                </div>
                <MapPin className="w-8 h-8 text-emerald-500" />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reverse Lookup: Postal Code to Location */}
      <Card>
        <CardHeader>
          <CardTitle>Search by Postal Code</CardTitle>
          <CardDescription>Enter a postal code to find the location</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input placeholder="Enter postal code (e.g., 60119)" value={searchCode} onChange={(e) => setSearchCode(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearchPostalCode()} />
            <Button onClick={handleSearchPostalCode} disabled={!searchCode.trim() || loading.search}>
              {loading.search ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            </Button>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="space-y-2">
              {searchResults.map((result, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="font-semibold">{result.village}</p>
                      <p className="text-sm text-muted-foreground">
                        {result.district}, {result.city}
                      </p>
                      <p className="text-sm text-muted-foreground">{result.province}</p>
                    </div>
                    <Badge variant="secondary">{result.postal}</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}

          {searchCode && searchResults.length === 0 && !loading.search && <p className="text-sm text-muted-foreground text-center py-4">No results found for postal code "{searchCode}"</p>}
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { useCallback, useState } from "react"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LedgerList, LedgerRow } from "@/components/ui/ledger"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getProvinces, getCities, getDistricts, getVillages, searchPostalCode } from "@/services/visitor/postal-code"
import { ToolError, useToolData } from "./tool-status"

const POSTAL_CODE = /^\d{5}$/
const none = () => Promise.resolve([])
const loadProvinces = () => getProvinces().then((res) => res.data ?? [])

/** The search upstream is fuzzy (a code also matches coordinates and other codes), so keep only exact hits. */
const searchExact = (query: string, keep: (hit: { code: string; postal: number }) => boolean) =>
  searchPostalCode(query).then((res) => (res.data?.data ?? []).filter(keep))

export function PostalCodeTab() {
  return (
    <div className="space-y-12">
      <ByPlace />
      <ByCode />
    </div>
  )
}

interface Place {
  code: string
  name: string
}

function PlaceSelect({
  id,
  label,
  value,
  onChange,
  places,
  loading,
  disabled,
}: Readonly<{ id: string; label: string; value: string; onChange: (code: string) => void; places?: Place[]; loading: boolean; disabled: boolean }>) {
  return (
    <div className="space-y-1">
      <Label htmlFor={id}>{label}</Label>
      <Select value={value} onValueChange={onChange} disabled={disabled || loading}>
        <SelectTrigger id={id}>
          <SelectValue placeholder={loading && !disabled ? "Loading…" : `Choose a ${label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent>
          {places?.map((p) => (
            <SelectItem key={p.code} value={p.code}>
              {p.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

function ByPlace() {
  const [province, setProvince] = useState("")
  const [city, setCity] = useState("")
  const [district, setDistrict] = useState("")
  const [village, setVillage] = useState("")

  const provinces = useToolData(loadProvinces)
  const cities = useToolData(useCallback(() => (province ? getCities(province).then((r) => r.data ?? []) : none()), [province]))
  const districts = useToolData(useCallback(() => (city ? getDistricts(city).then((r) => r.data ?? []) : none()), [city]))
  const villages = useToolData(useCallback(() => (district ? getVillages(district).then((r) => r.data ?? []) : none()), [district]))
  const postal = useToolData(useCallback(() => (village ? searchExact(village, (hit) => hit.code === village) : none()), [village]))

  const failed = [provinces, cities, districts, villages, postal].find((s) => s.status === "error")
  const villageName = villages.data?.find((v) => v.code === village)?.name
  const districtName = districts.data?.find((d) => d.code === district)?.name

  return (
    <section aria-labelledby="postal-by-place" className="space-y-4">
      <h3 id="postal-by-place" className="font-display text-h3 text-ink">
        Find a postal code
      </h3>
      <div className="grid gap-x-6 gap-y-4 md:grid-cols-2">
        <PlaceSelect
          id="postal-province"
          label="Province"
          value={province}
          places={provinces.data}
          loading={provinces.status === "loading"}
          disabled={false}
          onChange={(code) => {
            setProvince(code)
            setCity("")
            setDistrict("")
            setVillage("")
          }}
        />
        <PlaceSelect
          id="postal-city"
          label="City or regency"
          value={city}
          places={cities.data}
          loading={cities.status === "loading"}
          disabled={!province}
          onChange={(code) => {
            setCity(code)
            setDistrict("")
            setVillage("")
          }}
        />
        <PlaceSelect
          id="postal-district"
          label="District"
          value={district}
          places={districts.data}
          loading={districts.status === "loading"}
          disabled={!city}
          onChange={(code) => {
            setDistrict(code)
            setVillage("")
          }}
        />
        <PlaceSelect
          id="postal-village"
          label="Village"
          value={village}
          places={villages.data}
          loading={villages.status === "loading"}
          disabled={!district}
          onChange={setVillage}
        />
      </div>

      {failed && (
        <ToolError onRetry={failed.retry}>{failed === postal ? "The postal code lookup did not answer." : "The list of places did not load."}</ToolError>
      )}

      {village && postal.status !== "error" && (
        <div aria-live="polite" className="border-t border-ink pt-4">
          {postal.status === "loading" ? (
            <p className="font-display text-caption text-ink-soft">Looking up the postal code…</p>
          ) : postal.data?.[0] ? (
            <>
              <p className="font-display text-caption text-ink-soft">
                Postal code for {villageName}, {districtName}
              </p>
              <p className="font-display text-numeral tabular-nums text-ink">{postal.data[0].postal}</p>
            </>
          ) : (
            <p className="font-display text-body text-ink-soft">No postal code on file for {villageName ?? "this village"}.</p>
          )}
        </div>
      )}
    </section>
  )
}

function ByCode() {
  const [code, setCode] = useState("")
  const [query, setQuery] = useState("")
  const [invalid, setInvalid] = useState(false)
  const hits = useToolData(useCallback(() => (query ? searchExact(query, (hit) => String(hit.postal) === query) : none()), [query]))

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const value = code.trim()
    setInvalid(!POSTAL_CODE.test(value))
    if (POSTAL_CODE.test(value)) setQuery(value)
  }

  return (
    <section aria-labelledby="postal-by-code" className="space-y-4">
      <h3 id="postal-by-code" className="font-display text-h3 text-ink">
        Places for a postal code
      </h3>
      <form onSubmit={submit} noValidate className="space-y-2">
        <Label htmlFor="postal-code">Postal code</Label>
        <div className="flex items-end gap-3">
          <Input
            id="postal-code"
            inputMode="numeric"
            autoComplete="postal-code"
            maxLength={5}
            placeholder="65144"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            aria-invalid={invalid || undefined}
            aria-describedby={invalid ? "postal-code-error" : undefined}
            className="max-w-[12rem]"
          />
          <Button type="submit" disabled={hits.status === "loading" && Boolean(query)} aria-busy={hits.status === "loading" && Boolean(query)}>
            Look up
          </Button>
        </div>
        {invalid && (
          <p id="postal-code-error" className="flex gap-2 font-display text-caption text-ink">
            <X aria-hidden strokeWidth={1.5} className="mt-0.5 size-4 shrink-0" />
            A postal code has five digits, for example 65144.
          </p>
        )}
      </form>

      {query && (
        <div aria-live="polite">
          {hits.status === "error" ? (
            <ToolError onRetry={hits.retry}>The lookup did not answer.</ToolError>
          ) : hits.status === "loading" ? (
            <p className="font-display text-caption text-ink-soft">Looking up {query}…</p>
          ) : hits.data?.length ? (
            <>
              <p className="font-display text-caption text-ink-soft">
                {hits.data.length === 1 ? `One village uses ${query}.` : `${hits.data.length} villages share ${query}.`}
              </p>
              <LedgerList className="mt-2">
                {hits.data.map((hit) => (
                  <LedgerRow key={hit.code} titleAs="p" title={hit.village} meta={hit.postal}>
                    {hit.district}, {hit.city}, {hit.province}.
                  </LedgerRow>
                ))}
              </LedgerList>
            </>
          ) : (
            <p className="font-display text-body text-ink-soft">No village uses postal code {query}.</p>
          )}
        </div>
      )}
    </section>
  )
}

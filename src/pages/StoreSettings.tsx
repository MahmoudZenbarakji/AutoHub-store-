import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Card } from '@/components/common/Card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { StoreLocationMap } from '@/components/store-settings/StoreLocationMap';
import { StoreSettingsImageField } from '@/components/store-settings/StoreSettingsImageField';
import { useLanguageChange } from '@/hooks/useLanguageChange';
import { useStoreSettingsPage } from '@/hooks/useStoreSettingsPage';
import { weekDays } from '@/mock/storeSettingsData';
import { cn } from '@/lib/utils';

type InputKind = 'text' | 'email' | 'tel' | 'password' | 'textarea';

type GeneralRow =
  | { type: 'field'; key: keyof GeneralSettingsFormState; label: string; input: InputKind }
  | { type: 'image'; key: 'logo' | 'cover'; label: string; variant: 'logo' | 'cover' }
  | { type: 'location' };

const GENERAL_ROWS: GeneralRow[] = [
  { type: 'field', key: 'store_name', label: 'Store name', input: 'text' },
  { type: 'image', key: 'logo', label: 'Logo', variant: 'logo' },
  { type: 'image', key: 'cover', label: 'Cover', variant: 'cover' },
  { type: 'field', key: 'specialization', label: 'Specialization', input: 'text' },
  { type: 'location' },
  { type: 'field', key: 'address_details', label: 'Address details', input: 'text' },
  { type: 'field', key: 'store_description', label: 'Store description (Bio)', input: 'textarea' },
  { type: 'field', key: 'contact_email', label: 'Contact Email (optional)', input: 'email' },
  { type: 'field', key: 'contact_phone', label: 'Contact phone', input: 'tel' },
  { type: 'field', key: 'password', label: 'Change password', input: 'password' },
];

export function StoreSettings() {
  const {
    loading,
    general,
    setGeneralField,
    applyLocationFromMap,
    dailyFrom,
    setDailyFrom,
    dailyTo,
    setDailyTo,
    offDay,
    setOffDay,
    twentyFourHours,
    setTwentyFourHours,
    generalError,
    generalSuccess,
    hoursError,
    hoursSuccess,
    savingGeneral,
    savingHours,
    handleGeneralSubmit,
    handleHoursSubmit,
  } = useStoreSettingsPage();

  const { currentLanguage, selectLanguage, pending: langPending } = useLanguageChange();

  return (
    <>
      <Helmet>
        <title>AutoHub — Store Settings</title>
      </Helmet>
      <div className="flex w-full min-w-0 flex-col gap-6">
        <Tabs defaultValue="general" className="w-full min-w-0">
          <TabsList variant="line" className="w-full justify-start border-b border-border bg-transparent p-0">
            <TabsTrigger value="general" variant="line" size="md" className="rounded-none px-1 pb-3">
              General info
            </TabsTrigger>
            <TabsTrigger value="hours" variant="line" size="md" className="rounded-none px-1 pb-3">
              Operating hours
            </TabsTrigger>
            <TabsTrigger value="language" variant="line" size="md" className="rounded-none px-1 pb-3">
              Language
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="mt-6 focus-visible:outline-none">
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="mx-auto w-full max-w-2xl border p-8 shadow-xs sm:p-10">
                <form onSubmit={handleGeneralSubmit} className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Update only what you need: fields loaded from the server are shown below. On save, only fields
                    you filled are sent—empty fields are left unchanged on the server.
                  </p>
                  <ul className="space-y-4 text-start">
                    {GENERAL_ROWS.map((row) => {
                      if (row.type === 'image') {
                        return (
                          <li key={row.key}>
                            <StoreSettingsImageField
                              id={`settings-${row.key}`}
                              label={row.label}
                              value={general[row.key]}
                              onChange={(v) => setGeneralField(row.key, v)}
                              disabled={loading || savingGeneral}
                              variant={row.variant}
                            />
                          </li>
                        );
                      }
                      if (row.type === 'location') {
                        return (
                          <li key="location" className="space-y-3">
                            <span className="mb-1.5 block text-sm font-medium text-foreground">
                              Location
                            </span>
                            <p className="text-xs text-muted-foreground">
                              The map loads your saved coordinates. Click the map to move the pin; latitude and
                              longitude update below. You can also edit the text fields directly.
                            </p>
                            <StoreLocationMap
                              latitude={general.latitude}
                              longitude={general.longitude}
                              disabled={loading || savingGeneral}
                              onPick={(lat, lng) => {
                                applyLocationFromMap(lat, lng, `${lat}, ${lng}`);
                              }}
                            />
                            <div className="grid gap-3 sm:grid-cols-1">
                              <div>
                                <label
                                  htmlFor="settings-location-label"
                                  className="mb-1.5 block text-xs font-medium text-muted-foreground"
                                >
                                  Location label
                                </label>
                                <Input
                                  id="settings-location-label"
                                  value={general.location}
                                  onChange={(e) => setGeneralField('location', e.target.value)}
                                  placeholder="Address or place name"
                                  disabled={loading || savingGeneral}
                                />
                              </div>
                              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <div>
                                  <label
                                    htmlFor="settings-latitude"
                                    className="mb-1.5 block text-xs font-medium text-muted-foreground"
                                  >
                                    Latitude
                                  </label>
                                  <Input
                                    id="settings-latitude"
                                    inputMode="decimal"
                                    value={general.latitude}
                                    onChange={(e) => setGeneralField('latitude', e.target.value)}
                                    placeholder="e.g. 24.713600"
                                    disabled={loading || savingGeneral}
                                  />
                                </div>
                                <div>
                                  <label
                                    htmlFor="settings-longitude"
                                    className="mb-1.5 block text-xs font-medium text-muted-foreground"
                                  >
                                    Longitude
                                  </label>
                                  <Input
                                    id="settings-longitude"
                                    inputMode="decimal"
                                    value={general.longitude}
                                    onChange={(e) => setGeneralField('longitude', e.target.value)}
                                    placeholder="e.g. 46.675300"
                                    disabled={loading || savingGeneral}
                                  />
                                </div>
                              </div>
                            </div>
                          </li>
                        );
                      }
                      const { key, label, input } = row;
                      return (
                        <li key={key}>
                          <label
                            htmlFor={`settings-${key}`}
                            className="mb-1.5 block text-sm font-medium text-foreground"
                          >
                            {label}
                          </label>
                          {input === 'textarea' ? (
                            <Textarea
                              id={`settings-${key}`}
                              variant="md"
                              value={general[key]}
                              onChange={(e) => setGeneralField(key, e.target.value)}
                              disabled={loading || savingGeneral}
                              rows={4}
                            />
                          ) : (
                            <Input
                              id={`settings-${key}`}
                              type={input === 'password' ? 'password' : input}
                              value={general[key]}
                              onChange={(e) => setGeneralField(key, e.target.value)}
                              disabled={loading || savingGeneral}
                              autoComplete={input === 'password' ? 'new-password' : 'off'}
                            />
                          )}
                        </li>
                      );
                    })}
                  </ul>
                  {generalError ? (
                    <p className="text-sm text-destructive" role="alert">
                      {generalError}
                    </p>
                  ) : null}
                  {generalSuccess ? (
                    <p className="text-sm text-emerald-600 dark:text-emerald-500" role="status">
                      {generalSuccess}
                    </p>
                  ) : null}
                  <div className="flex justify-end pt-2">
                    <Button type="submit" variant="primary" size="sm" disabled={loading || savingGeneral}>
                      {savingGeneral ? 'Saving…' : 'Save'}
                    </Button>
                  </div>
                </form>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="hours" className="mt-6 focus-visible:outline-none">
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-8"
            >
              <form onSubmit={handleHoursSubmit} className="space-y-8">
                <div className="flex flex-wrap items-center gap-2 gap-y-3 text-sm">
                  <span className="font-medium text-foreground">Daily</span>
                  <span className="text-muted-foreground">From</span>
                  <Input
                    type="time"
                    value={dailyFrom}
                    onChange={(e) => setDailyFrom(e.target.value)}
                    disabled={twentyFourHours || loading || savingHours}
                    className={cn('w-[7.5rem]', twentyFourHours && 'opacity-50')}
                  />
                  <span className="text-muted-foreground">To</span>
                  <Input
                    type="time"
                    value={dailyTo}
                    onChange={(e) => setDailyTo(e.target.value)}
                    disabled={twentyFourHours || loading || savingHours}
                    className={cn('w-[7.5rem]', twentyFourHours && 'opacity-50')}
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2 gap-y-3 text-sm">
                  <span className="font-medium text-foreground">Off</span>
                  <Select
                    value={offDay}
                    onValueChange={setOffDay}
                    disabled={loading || savingHours}
                  >
                    <SelectTrigger className="w-[10rem]">
                      <SelectValue placeholder="Day" />
                    </SelectTrigger>
                    <SelectContent>
                      {weekDays.map((day) => (
                        <SelectItem key={day} value={day}>
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <label className="flex cursor-pointer items-center gap-2 text-sm">
                  <Checkbox
                    checked={twentyFourHours}
                    onCheckedChange={(v) => setTwentyFourHours(v === true)}
                    disabled={loading || savingHours}
                  />
                  <span className="text-foreground">24 hours</span>
                </label>

                {hoursError ? (
                  <p className="text-sm text-destructive" role="alert">
                    {hoursError}
                  </p>
                ) : null}
                {hoursSuccess ? (
                  <p className="text-sm text-emerald-600 dark:text-emerald-500" role="status">
                    {hoursSuccess}
                  </p>
                ) : null}

                <div className="flex justify-end">
                  <Button type="submit" variant="primary" size="sm" disabled={loading || savingHours}>
                    {savingHours ? 'Saving…' : 'Save'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </TabsContent>

          <TabsContent value="language" className="mt-6 focus-visible:outline-none">
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="mx-auto w-full max-w-2xl border p-8 shadow-xs sm:p-10">
                <p className="mb-6 text-center text-sm text-muted-foreground sm:text-start">
                  Choose the dashboard language. Your preference is saved and Arabic uses right-to-left layout.
                </p>
                <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
                  <Button
                    type="button"
                    variant={currentLanguage === 'en' ? 'primary' : 'outline'}
                    size="sm"
                    disabled={langPending}
                    onClick={() => void selectLanguage('en')}
                  >
                    English
                  </Button>
                  <Button
                    type="button"
                    variant={currentLanguage === 'ar' ? 'primary' : 'outline'}
                    size="sm"
                    disabled={langPending}
                    onClick={() => void selectLanguage('ar')}
                  >
                    العربية
                  </Button>
                </div>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>

    </>
  );
}

import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { Card } from '@/components/common/Card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/common/Input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { generalInfoFieldLabels, weekDays } from '@/mock/storeSettingsData';
import { cn } from '@/lib/utils';

export function StoreSettings() {
  const [dailyFrom, setDailyFrom] = useState('06:00');
  const [dailyTo, setDailyTo] = useState('18:00');
  const [offDay, setOffDay] = useState<string>('Friday');
  const [twentyFourHours, setTwentyFourHours] = useState(false);

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
          </TabsList>

          <TabsContent value="general" className="mt-6 focus-visible:outline-none">
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="mx-auto w-full max-w-2xl border p-8 shadow-xs sm:p-10">
                <ul className="space-y-4 text-center">
                  {generalInfoFieldLabels.map((label) => (
                    <li key={label} className="text-sm font-medium text-foreground">
                      {label}
                    </li>
                  ))}
                </ul>
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
              <div className="flex flex-wrap items-center gap-2 gap-y-3 text-sm">
                <span className="font-medium text-foreground">Daily</span>
                <span className="text-muted-foreground">From</span>
                <Input
                  type="time"
                  value={dailyFrom}
                  onChange={(e) => setDailyFrom(e.target.value)}
                  disabled={twentyFourHours}
                  className={cn('w-[7.5rem]', twentyFourHours && 'opacity-50')}
                />
                <span className="text-muted-foreground">To</span>
                <Input
                  type="time"
                  value={dailyTo}
                  onChange={(e) => setDailyTo(e.target.value)}
                  disabled={twentyFourHours}
                  className={cn('w-[7.5rem]', twentyFourHours && 'opacity-50')}
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 gap-y-3 text-sm">
                <span className="font-medium text-foreground">Off</span>
                <Select value={offDay} onValueChange={setOffDay}>
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
                />
                <span className="text-foreground">24 hours</span>
              </label>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

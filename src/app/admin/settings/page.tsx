'use client';

import { useState, useEffect } from 'react';
import { Button, Input, FormSection, FormField } from '@/components/admin/ui';
import { Save, Store, Phone, Mail, Globe, Clock, Truck, DollarSign, CreditCard } from 'lucide-react';

interface BusinessSettings {
  id: string;
  businessName: string;
  tradingName: string | null;
  tagline: string | null;
  description: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  facebook: string | null;
  instagram: string | null;
  vatNumber: string | null;
  companyNumber: string | null;
  vatRate: number;
  vatRegistered: boolean;
  currency: string;
  currencySymbol: string;
  hourlyRate: number;
  prepRate: number;
  bakeRate: number;
  overtimeRate: number;
  overheadPercent: number;
  targetMargin: number;
  orderLeadTime: number;
  maxDailyOrders: number;
  cutoffTime: string;
  deliveryEnabled: boolean;
  minDeliveryOrder: number;
  maxDeliveryDistance: number;
  collectionPoints: string;
  openingHours: string;
  termsUrl: string | null;
  privacyUrl: string | null;
  shopEnabled: boolean;
  preorderEnabled: boolean;
  emailNotifications: boolean;
  orderAlerts: boolean;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await fetch('/api/settings');
        if (response.ok) {
          const data = await response.json();
          setSettings(data);
        } else {
          // Use default settings
          setSettings({
            id: 'default',
            businessName: 'The Little Bakers',
            tradingName: null,
            tagline: null,
            description: null,
            address: null,
            phone: null,
            email: null,
            website: null,
            facebook: null,
            instagram: null,
            vatNumber: null,
            companyNumber: null,
            vatRate: 20,
            vatRegistered: false,
            currency: 'GBP',
            currencySymbol: '£',
            hourlyRate: 12,
            prepRate: 15,
            bakeRate: 12,
            overtimeRate: 18,
            overheadPercent: 20,
            targetMargin: 40,
            orderLeadTime: 72,
            maxDailyOrders: 10,
            cutoffTime: '15:00',
            deliveryEnabled: false,
            minDeliveryOrder: 2500,
            maxDeliveryDistance: 10,
            collectionPoints: '[]',
            openingHours: '{}',
            termsUrl: null,
            privacyUrl: null,
            shopEnabled: false,
            preorderEnabled: true,
            emailNotifications: true,
            orderAlerts: true,
          });
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (key: keyof BusinessSettings, value: any) => {
    if (settings) {
      setSettings({ ...settings, [key]: value });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded bg-var(--color-bg-secondary)]" />
        <div className="h-64 animate-pulse rounded-xl bg-var(--color-bg-card)]" />
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="text-center">
        <p className="text-var(--color-text-muted)]">Failed to load settings</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-var(--color-text-primary)]">
            Settings
          </h1>
          <p className="mt-1 text-sm text-var(--color-text-secondary)]">
            Configure your bakery business settings.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="text-sm text-green-600">Settings saved!</span>
          )}
          <Button 
            icon={<Save className="h-4 w-4" />} 
            onClick={handleSave}
            loading={saving}
          >
            Save Changes
          </Button>
        </div>
      </div>

      {/* Business Information */}
      <FormSection 
        title="Business Information" 
        description="Basic details about your bakery"
        icon={<Store className="h-5 w-5" />}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Business Name"
            value={settings.businessName}
            onChange={(e) => updateSetting('businessName', e.target.value)}
          />
          <Input
            label="Trading Name"
            value={settings.tradingName || ''}
            onChange={(e) => updateSetting('tradingName', e.target.value || null)}
          />
          <Input
            label="Tagline"
            value={settings.tagline || ''}
            onChange={(e) => updateSetting('tagline', e.target.value || null)}
            className="md:col-span-2"
          />
          <Input
            label="Address"
            value={settings.address || ''}
            onChange={(e) => updateSetting('address', e.target.value || null)}
            className="md:col-span-2"
          />
          <Input
            label="Phone"
            value={settings.phone || ''}
            onChange={(e) => updateSetting('phone', e.target.value || null)}
          />
          <Input
            label="Email"
            type="email"
            value={settings.email || ''}
            onChange={(e) => updateSetting('email', e.target.value || null)}
          />
          <Input
            label="Website"
            value={settings.website || ''}
            onChange={(e) => updateSetting('website', e.target.value || null)}
          />
          <Input
            label="Facebook URL"
            value={settings.facebook || ''}
            onChange={(e) => updateSetting('facebook', e.target.value || null)}
          />
          <Input
            label="Instagram URL"
            value={settings.instagram || ''}
            onChange={(e) => updateSetting('instagram', e.target.value || null)}
          />
        </div>
      </FormSection>

      {/* VAT & Tax Settings */}
      <FormSection 
        title="VAT & Tax" 
        description="Configure VAT and tax settings"
        icon={<DollarSign className="h-5 w-5" />}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="vatRegistered"
              checked={settings.vatRegistered}
              onChange={(e) => updateSetting('vatRegistered', e.target.checked)}
              className="h-4 w-4 rounded border-var(--color-border)] text-var(--color-primary)]"
            />
            <label htmlFor="vatRegistered" className="text-sm text-var(--color-text-primary)]">
              VAT Registered
            </label>
          </div>
          <Input
            label="VAT Number"
            value={settings.vatNumber || ''}
            onChange={(e) => updateSetting('vatNumber', e.target.value || null)}
          />
          <Input
            label="VAT Rate (%)"
            type="number"
            value={settings.vatRate}
            onChange={(e) => updateSetting('vatRate', parseFloat(e.target.value) || 0)}
          />
          <Input
            label="Company Number"
            value={settings.companyNumber || ''}
            onChange={(e) => updateSetting('companyNumber', e.target.value || null)}
          />
        </div>
      </FormSection>

      {/* Currency Settings */}
      <FormSection 
        title="Currency" 
        description="Configure currency and symbols"
        icon={<CreditCard className="h-5 w-5" />}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Currency Code"
            value={settings.currency}
            onChange={(e) => updateSetting('currency', e.target.value)}
          />
          <Input
            label="Currency Symbol"
            value={settings.currencySymbol}
            onChange={(e) => updateSetting('currencySymbol', e.target.value)}
          />
        </div>
      </FormSection>

      {/* Labor Rates */}
      <FormSection 
        title="Labor Rates" 
        description="Configure hourly rates for cost calculations"
        icon={<Clock className="h-5 w-5" />}
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Input
            label="Standard Hourly Rate (£)"
            type="number"
            step="0.01"
            value={settings.hourlyRate}
            onChange={(e) => updateSetting('hourlyRate', parseFloat(e.target.value) || 0)}
          />
          <Input
            label="Prep Rate (£/hr)"
            type="number"
            step="0.01"
            value={settings.prepRate}
            onChange={(e) => updateSetting('prepRate', parseFloat(e.target.value) || 0)}
          />
          <Input
            label="Bake Rate (£/hr)"
            type="number"
            step="0.01"
            value={settings.bakeRate}
            onChange={(e) => updateSetting('bakeRate', parseFloat(e.target.value) || 0)}
          />
          <Input
            label="Overtime Rate (£/hr)"
            type="number"
            step="0.01"
            value={settings.overtimeRate}
            onChange={(e) => updateSetting('overtimeRate', parseFloat(e.target.value) || 0)}
          />
          <Input
            label="Overhead Percentage (%)"
            type="number"
            step="0.1"
            value={settings.overheadPercent}
            onChange={(e) => updateSetting('overheadPercent', parseFloat(e.target.value) || 0)}
          />
          <Input
            label="Target Profit Margin (%)"
            type="number"
            step="0.1"
            value={settings.targetMargin}
            onChange={(e) => updateSetting('targetMargin', parseFloat(e.target.value) || 0)}
          />
        </div>
      </FormSection>

      {/* Order Settings */}
      <FormSection 
        title="Order Settings" 
        description="Configure order processing settings"
        icon={<Clock className="h-5 w-5" />}
      >
        <div className="grid gap-4 md:grid-cols-3">
          <Input
            label="Order Lead Time (hours)"
            type="number"
            value={settings.orderLeadTime}
            onChange={(e) => updateSetting('orderLeadTime', parseInt(e.target.value) || 0)}
          />
          <Input
            label="Max Daily Orders"
            type="number"
            value={settings.maxDailyOrders}
            onChange={(e) => updateSetting('maxDailyOrders', parseInt(e.target.value) || 0)}
          />
          <Input
            label="Cutoff Time"
            type="time"
            value={settings.cutoffTime}
            onChange={(e) => updateSetting('cutoffTime', e.target.value)}
          />
        </div>
        <div className="mt-4 space-y-3">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="shopEnabled"
              checked={settings.shopEnabled}
              onChange={(e) => updateSetting('shopEnabled', e.target.checked)}
              className="h-4 w-4 rounded border-var(--color-border)] text-var(--color-primary)]"
            />
            <label htmlFor="shopEnabled" className="text-sm text-var(--color-text-primary)]">
              Enable online shop
            </label>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="preorderEnabled"
              checked={settings.preorderEnabled}
              onChange={(e) => updateSetting('preorderEnabled', e.target.checked)}
              className="h-4 w-4 rounded border-var(--color-border)] text-var(--color-primary)]"
            />
            <label htmlFor="preorderEnabled" className="text-sm text-var(--color-text-primary)]">
              Enable pre-orders
            </label>
          </div>
        </div>
      </FormSection>

      {/* Delivery Settings */}
      <FormSection 
        title="Delivery Settings" 
        description="Configure delivery options"
        icon={<Truck className="h-5 w-5" />}
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="deliveryEnabled"
              checked={settings.deliveryEnabled}
              onChange={(e) => updateSetting('deliveryEnabled', e.target.checked)}
              className="h-4 w-4 rounded border-var(--color-border)] text-var(--color-primary)]"
            />
            <label htmlFor="deliveryEnabled" className="text-sm text-var(--color-text-primary)]">
              Enable delivery
            </label>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Min Delivery Order (£)"
              type="number"
              value={settings.minDeliveryOrder / 100}
              onChange={(e) => updateSetting('minDeliveryOrder', Math.round(parseFloat(e.target.value || '0') * 100))}
            />
            <Input
              label="Max Delivery Distance (km)"
              type="number"
              value={settings.maxDeliveryDistance}
              onChange={(e) => updateSetting('maxDeliveryDistance', parseInt(e.target.value) || 0)}
            />
          </div>
        </div>
      </FormSection>

      {/* Notifications */}
      <FormSection 
        title="Notifications" 
        description="Configure notification preferences"
        icon={<Mail className="h-5 w-5" />}
      >
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="emailNotifications"
              checked={settings.emailNotifications}
              onChange={(e) => updateSetting('emailNotifications', e.target.checked)}
              className="h-4 w-4 rounded border-var(--color-border)] text-var(--color-primary)]"
            />
            <label htmlFor="emailNotifications" className="text-sm text-var(--color-text-primary)]">
              Send email notifications
            </label>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="orderAlerts"
              checked={settings.orderAlerts}
              onChange={(e) => updateSetting('orderAlerts', e.target.checked)}
              className="h-4 w-4 rounded border-var(--color-border)] text-var(--color-primary)]"
            />
            <label htmlFor="orderAlerts" className="text-sm text-var(--color-text-primary)]">
              Order alerts
            </label>
          </div>
        </div>
      </FormSection>

      {/* Legal */}
      <FormSection 
        title="Legal & Compliance" 
        description="Legal URLs and compliance information"
        icon={<Globe className="h-5 w-5" />}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Terms of Service URL"
            value={settings.termsUrl || ''}
            onChange={(e) => updateSetting('termsUrl', e.target.value || null)}
          />
          <Input
            label="Privacy Policy URL"
            value={settings.privacyUrl || ''}
            onChange={(e) => updateSetting('privacyUrl', e.target.value || null)}
          />
        </div>
      </FormSection>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button 
          icon={<Save className="h-4 w-4" />} 
          onClick={handleSave}
          loading={saving}
        >
          Save All Changes
        </Button>
      </div>
    </div>
  );
}
import React from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Select, Badge, Tabs, TabsList, TabsTrigger, TabsContent } from './components/ui';

export default function DesignSystemTest() {
  const [activeTab, setActiveTab] = React.useState('buttons');

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Design System Foundation</h1>
          <p className="text-lg text-gray-600">Modern UI components with enhanced design tokens</p>
        </div>

        <Tabs>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="buttons" isActive={activeTab === 'buttons'} onClick={setActiveTab}>
              Buttons
            </TabsTrigger>
            <TabsTrigger value="cards" isActive={activeTab === 'cards'} onClick={setActiveTab}>
              Cards
            </TabsTrigger>
            <TabsTrigger value="forms" isActive={activeTab === 'forms'} onClick={setActiveTab}>
              Forms
            </TabsTrigger>
            <TabsTrigger value="badges" isActive={activeTab === 'badges'} onClick={setActiveTab}>
              Badges
            </TabsTrigger>
          </TabsList>

          <TabsContent value="buttons" activeTab={activeTab}>
            <Card>
              <CardHeader>
                <CardTitle>Button Variants & Sizes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Variants</h4>
                    <div className="flex flex-wrap gap-3">
                      <Button variant="default">Default</Button>
                      <Button variant="outline">Outline</Button>
                      <Button variant="secondary">Secondary</Button>
                      <Button variant="destructive">Destructive</Button>
                      <Button variant="ghost">Ghost</Button>
                      <Button variant="success">Success</Button>
                      <Button variant="warning">Warning</Button>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Sizes</h4>
                    <div className="flex flex-wrap items-center gap-3">
                      <Button size="sm">Small</Button>
                      <Button size="default">Default</Button>
                      <Button size="lg">Large</Button>
                      <Button size="xl">Extra Large</Button>
                      <Button size="icon">🎨</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cards" activeTab={activeTab}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle level={3}>Basic Card</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">This is a basic card with standard styling.</p>
                </CardContent>
              </Card>
              
              <Card interactive>
                <CardHeader>
                  <CardTitle level={3}>Interactive Card</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">This card has hover effects and enhanced shadows.</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="forms" activeTab={activeTab}>
            <Card>
              <CardHeader>
                <CardTitle>Form Elements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Input Sizes</h4>
                    <div className="space-y-3">
                      <Input size="sm" placeholder="Small input" />
                      <Input size="default" placeholder="Default input" />
                      <Input size="lg" placeholder="Large input" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Select & Error States</h4>
                    <div className="space-y-3">
                      <Select>
                        <option>Choose an option</option>
                        <option>Option 1</option>
                        <option>Option 2</option>
                      </Select>
                      <Input error placeholder="Input with error state" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="badges" activeTab={activeTab}>
            <Card>
              <CardHeader>
                <CardTitle>Badge Variants & Sizes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Variants</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="default">Default</Badge>
                      <Badge variant="secondary">Secondary</Badge>
                      <Badge variant="destructive">Destructive</Badge>
                      <Badge variant="success">Success</Badge>
                      <Badge variant="warning">Warning</Badge>
                      <Badge variant="neutral">Neutral</Badge>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Sizes</h4>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge size="sm">Small</Badge>
                      <Badge size="default">Default</Badge>
                      <Badge size="lg">Large</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle>Design System Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h5 className="font-semibold text-blue-900 mb-2">Color Palette</h5>
                <p className="text-sm text-blue-700">Comprehensive semantic color system with primary, secondary, success, warning, and error variants.</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h5 className="font-semibold text-green-900 mb-2">Typography Scale</h5>
                <p className="text-sm text-green-700">Consistent font sizes and line heights with improved readability and hierarchy.</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <h5 className="font-semibold text-purple-900 mb-2">Component Sizing</h5>
                <p className="text-sm text-purple-700">Standardized heights, spacing, and sizing across all interactive elements.</p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <h5 className="font-semibold text-yellow-900 mb-2">Shadow System</h5>
                <p className="text-sm text-yellow-700">Enhanced shadow utilities for depth and visual hierarchy.</p>
              </div>
              <div className="p-4 bg-red-50 rounded-lg">
                <h5 className="font-semibold text-red-900 mb-2">Transitions</h5>
                <p className="text-sm text-red-700">Smooth animations and micro-interactions for better user experience.</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h5 className="font-semibold text-gray-900 mb-2">Accessibility</h5>
                <p className="text-sm text-gray-700">Enhanced focus states, contrast ratios, and keyboard navigation support.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
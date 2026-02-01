// src/pages/TestComponents.tsx
// TEMPORARY page to preview all common components
// We will DELETE this page later once RecipeCard is built

import { type FC } from "react";
import { Search, Clock, Leaf } from "lucide-react";

import Button from "../components/common/Button";
import Badge from "../components/common/Badge";
import Input from "../components/common/Input";

const TestComponents: FC = () => {
  return (
    <div className="max-w-3xl px-4 py-10 mx-auto space-y-12">
      {/* ════════════════════════════ */}
      {/* BUTTONS */}
      {/* ════════════════════════════ */}
      <section>
        <h2 className="mb-6 text-2xl font-bold text-gray-800">Buttons</h2>

        {/* Variants */}
        <div className="mb-4">
          <p className="mb-2 text-sm text-gray-500">Variants</p>
          <div className="flex flex-wrap gap-3">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="ghost">Ghost</Button>
          </div>
        </div>

        {/* Sizes */}
        <div className="mb-4">
          <p className="mb-2 text-sm text-gray-500">Sizes</p>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary" size="small">Small</Button>
            <Button variant="primary" size="medium">Medium</Button>
            <Button variant="primary" size="large">Large</Button>
          </div>
        </div>

        {/* Disabled */}
        <div className="mb-4">
          <p className="mb-2 text-sm text-gray-500">Disabled</p>
          <div className="flex flex-wrap gap-3">
            <Button variant="primary" disabled>Disabled Primary</Button>
            <Button variant="secondary" disabled>Disabled Secondary</Button>
          </div>
        </div>

        {/* With Icons (lucide icons work inside Button because children accepts ReactNode) */}
        <div>
          <p className="mb-2 text-sm text-gray-500">With Icons</p>
          <div className="flex flex-wrap gap-3">
            <Button variant="primary">
              <Search size={16} /> Search
            </Button>
            <Button variant="secondary">
              <Clock size={16} /> 30 min
            </Button>
          </div>
        </div>
      </section>

      {/* ════════════════════════════ */}
      {/* BADGES */}
      {/* ════════════════════════════ */}
      <section>
        <h2 className="mb-6 text-2xl font-bold text-gray-800">Badges</h2>

        {/* Variants */}
        <div className="mb-4">
          <p className="mb-2 text-sm text-gray-500">Variants</p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="primary">Primary</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="danger">Danger</Badge>
          </div>
        </div>

        {/* Real-world usage examples */}
        <div className="mb-4">
          <p className="mb-2 text-sm text-gray-500">Cuisine Tags</p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="primary">Italian</Badge>
            <Badge variant="primary">Indian</Badge>
            <Badge variant="primary">Thai</Badge>
            <Badge variant="primary">Japanese</Badge>
          </div>
        </div>

        <div className="mb-4">
          <p className="mb-2 text-sm text-gray-500">Meal Types</p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Breakfast</Badge>
            <Badge variant="secondary">Lunch</Badge>
            <Badge variant="secondary">Dinner</Badge>
            <Badge variant="secondary">Dessert</Badge>
          </div>
        </div>

        {/* Badges with icons */}
        <div>
          <p className="mb-2 text-sm text-gray-500">With Icons</p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="success" icon={<Leaf size={12} />}>Vegan</Badge>
            <Badge variant="warning" icon={<Clock size={12} />}>45 min</Badge>
            <Badge variant="primary" icon={<Leaf size={12} />}>Vegetarian</Badge>
          </div>
        </div>
      </section>

      {/* ════════════════════════════ */}
      {/* INPUTS */}
      {/* ════════════════════════════ */}
      <section>
        <h2 className="mb-6 text-2xl font-bold text-gray-800">Inputs</h2>

        {/* Basic input */}
        <div className="mb-6">
          <p className="mb-2 text-sm text-gray-500">Basic Input</p>
          <Input
            label="Recipe Title"
            placeholder="e.g., Creamy Mushroom Pasta"
          />
        </div>

        {/* Required input */}
        <div className="mb-6">
          <p className="mb-2 text-sm text-gray-500">Required Input</p>
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            required
          />
        </div>

        {/* Input with error */}
        <div className="mb-6">
          <p className="mb-2 text-sm text-gray-500">Input with Error</p>
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            required
            error="Please enter a valid email address"
          />
        </div>

        {/* Input with icon */}
        <div className="mb-6">
          <p className="mb-2 text-sm text-gray-500">Input with Icon</p>
          <Input
            label="Search Recipes"
            placeholder="Search for something..."
            icon={<Search size={18} />}
          />
        </div>

        {/* Disabled input */}
        <div className="mb-6">
          <p className="mb-2 text-sm text-gray-500">Disabled Input</p>
          <Input
            label="Username"
            placeholder="Cannot change this"
            disabled
          />
        </div>

        {/* Password input */}
        <div>
          <p className="mb-2 text-sm text-gray-500">Password Input</p>
          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            required
          />
        </div>
      </section>
    </div>
  );
};

export default TestComponents;
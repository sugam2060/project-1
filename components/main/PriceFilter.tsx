'use client'
import { useState, useEffect } from 'react'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import { X, DollarSign } from 'lucide-react'

interface PriceRange {
  min: number;
  max: number;
}

interface PriceFilterProps {
  priceRange: PriceRange;
  setPriceRange: (range: PriceRange) => void;
  minPrice?: number;
  maxPrice?: number;
  onApplyFilter: () => void;
  className?: string;
}

const PriceFilter = ({
  priceRange,
  setPriceRange,
  minPrice = 0,
  maxPrice = 10000,
  onApplyFilter,
  className
}: PriceFilterProps) => {
  const [localPriceRange, setLocalPriceRange] = useState<PriceRange>(priceRange);
  const [isOpen, setIsOpen] = useState(false);

  // Update local state when props change
  useEffect(() => {
    setLocalPriceRange(priceRange);
  }, [priceRange]);

  const handleSliderChange = (values: number[]) => {
    setLocalPriceRange({
      min: values[0],
      max: values[1]
    });
  };

  const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || minPrice;
    setLocalPriceRange(prev => ({
      ...prev,
      min: Math.min(value, prev.max - 1)
    }));
  };

  const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || maxPrice;
    setLocalPriceRange(prev => ({
      ...prev,
      max: Math.max(value, prev.min + 1)
    }));
  };

  const applyFilter = () => {
    setPriceRange(localPriceRange);
    onApplyFilter();
    setIsOpen(false);
  };

  const resetFilter = () => {
    const resetRange = { min: minPrice, max: maxPrice };
    setLocalPriceRange(resetRange);
    setPriceRange(resetRange);
    onApplyFilter();
    setIsOpen(false);
  };

  const hasActiveFilter = priceRange.min > minPrice || priceRange.max < maxPrice;

  return (
    <div className={className}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="h-10 px-3 gap-2 relative flex items-center"
          >
            <DollarSign className="h-4 w-4" />
            Price
            {hasActiveFilter && (
              <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-xs flex items-center gap-1">
                ${priceRange.min} - ${priceRange.max}
                <button
                  onClick={resetFilter}
                  className="hover:bg-gray-300 rounded-full p-0.5"
                  aria-label="Clear price filter"
                  type="button"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </Button>
        </PopoverTrigger>


        <PopoverContent className="w-80 p-4" align="start">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm">Filter by Price</h4>
              {hasActiveFilter && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetFilter}
                  className="h-auto p-1 text-xs"
                >
                  Clear
                </Button>
              )}
            </div>

            {/* Price Range Inputs */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label htmlFor="min-price" className="text-xs">Min Price</Label>
                <Input
                  id="min-price"
                  type="number"
                  value={localPriceRange.min || ''}
                  onChange={handleMinInputChange}
                  placeholder="0"
                  className="h-8"
                  min={minPrice}
                  max={maxPrice}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="max-price" className="text-xs">Max Price</Label>
                <Input
                  id="max-price"
                  type="number"
                  value={localPriceRange.max || ''}
                  onChange={handleMaxInputChange}
                  placeholder="10000"
                  className="h-8"
                  min={minPrice}
                  max={maxPrice}
                />
              </div>
            </div>

            {/* Price Range Slider */}
            <div className="space-y-3">
              <Label className="text-xs">Price Range</Label>
              <div className="px-3">
                <Slider
                  value={[localPriceRange.min, localPriceRange.max]}
                  onValueChange={handleSliderChange}
                  max={maxPrice}
                  min={minPrice}
                  step={10}
                  className="w-full"
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>${localPriceRange.min}</span>
                <span>${localPriceRange.max}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <Button
                onClick={applyFilter}
                className="flex-1 h-8 text-xs"
                size="sm"
              >
                Apply Filter
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="flex-1 h-8 text-xs"
                size="sm"
              >
                Cancel
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Active Filter Display */}
      {/* {hasActiveFilter && (
        <div className="flex items-center gap-1 ml-2">
          <Badge variant="secondary" className="gap-1">
            ${priceRange.min} - ${priceRange.max}
            <button
              onClick={resetFilter}
              className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        </div>
      )} */}
    </div>
  );
};

export default PriceFilter;
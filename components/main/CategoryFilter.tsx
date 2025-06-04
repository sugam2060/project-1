'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Search, X, Grid3X3 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Category {
  category: string;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  onApplyFilter: () => void;
  className?: string;
}

const CategoryFilter = ({
  categories,
  selectedCategories,
  setSelectedCategories,
  onApplyFilter,
  className
}: CategoryFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [localSelectedCategories, setLocalSelectedCategories] = useState<string[]>(selectedCategories);

  // Filter categories based on search term
  const filteredCategories = categories.filter(cat =>
    cat.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCategoryToggle = (categoryName: string) => {
    setLocalSelectedCategories(prev => {
      if (prev.includes(categoryName)) {
        return prev.filter(cat => cat !== categoryName);
      } else {
        return [...prev, categoryName];
      }
    });
  };

  const handleSelectAll = () => {
    if (localSelectedCategories.length === filteredCategories.length) {
      setLocalSelectedCategories([]);
    } else {
      setLocalSelectedCategories(filteredCategories.map(cat => cat.category));
    }
  };

  const applyFilter = () => {
    setSelectedCategories(localSelectedCategories);
    onApplyFilter();
    setIsOpen(false);
  };

  const resetFilter = () => {
    setLocalSelectedCategories([]);
    setSelectedCategories([]);
    onApplyFilter();
    setIsOpen(false);
  };

  const clearSingleCategory = (categoryToRemove: string) => {
    const updatedCategories = selectedCategories.filter(cat => cat !== categoryToRemove);
    setSelectedCategories(updatedCategories);
    setLocalSelectedCategories(updatedCategories);
    onApplyFilter();
  };

  const hasActiveFilter = selectedCategories.length > 0;
  const isAllSelected = localSelectedCategories.length === filteredCategories.length && filteredCategories.length > 0;
  const isSomeSelected = localSelectedCategories.length > 0 && localSelectedCategories.length < filteredCategories.length;

  return (
    <div className={cn("flex items-center gap-2 flex-wrap", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="h-10 px-3 gap-2 relative"
          >
            <Grid3X3 className="h-4 w-4" />
            Categories
            {hasActiveFilter && (
              <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                {selectedCategories.length}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-80 p-0" align="start">
          <div className="p-4 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm">Filter by Categories</h4>
              {hasActiveFilter && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetFilter}
                  className="h-auto p-1 text-xs"
                >
                  Clear All
                </Button>
              )}
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 h-9"
              />
            </div>

            {/* Select All */}
            {filteredCategories.length > 0 && (
              <div className="flex items-center space-x-2 pb-2 border-b">
                <Checkbox
                  id="select-all"
                  checked={isAllSelected}
                  onCheckedChange={handleSelectAll}
                  ref={(ref) => {
                    if (ref) {
                      (ref as HTMLInputElement).indeterminate = isSomeSelected;
                    }
                  }}
                />
                <label
                  htmlFor="select-all"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Select All ({filteredCategories.length})
                </label>
              </div>
            )}

            {/* Categories List */}
            <ScrollArea className="h-64">
              <div className="space-y-2">
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((category) => (
                    <div
                      key={category.category}
                      className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleCategoryToggle(category.category)}
                    >
                      <Checkbox
                        id={`category-${category.category}`}
                        checked={localSelectedCategories.includes(category.category)}
                        onCheckedChange={() => handleCategoryToggle(category.category)}
                      />
                      <label
                        htmlFor={`category-${category.category}`}
                        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                      >
                        {category.category}
                      </label>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-sm text-muted-foreground">
                    No categories found
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2 border-t">
              <Button
                onClick={applyFilter}
                className="flex-1 h-8 text-xs"
                size="sm"
                disabled={JSON.stringify(localSelectedCategories.sort()) === JSON.stringify(selectedCategories.sort())}
              >
                Apply Filter
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setLocalSelectedCategories(selectedCategories);
                  setIsOpen(false);
                }}
                className="flex-1 h-8 text-xs"
                size="sm"
              >
                Cancel
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Active Category Badges */}
      {selectedCategories.length > 0 && (
        <div className="flex items-center gap-1 flex-wrap">
          {selectedCategories.slice(0, 3).map((category) => (
            <Badge
              key={category}
              variant="secondary"
              className="gap-1 pr-1"
            >
              {category}
              <button
                onClick={() => clearSingleCategory(category)}
                className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {selectedCategories.length > 3 && (
            <Badge variant="secondary">
              +{selectedCategories.length - 3} more
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryFilter;
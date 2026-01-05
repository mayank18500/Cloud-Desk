import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FilterBarProps {
  onSearch: (query: string) => void;
  onSkillFilter: (skill: string | null) => void;
  onPriceFilter: (range: { min: number; max: number } | null) => void;
  skills: string[];
  className?: string;
}

export function FilterBar({
  onSearch,
  onSkillFilter,
  onPriceFilter,
  skills,
  className,
}: FilterBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch(value);
  };

  const handleSkillChange = (value: string) => {
    const skill = value === 'all' ? null : value;
    setSelectedSkill(skill);
    onSkillFilter(skill);
  };

  const handlePriceChange = (value: string) => {
    setPriceRange(value);
    if (value === 'all') {
      onPriceFilter(null);
    } else {
      const [min, max] = value.split('-').map(Number);
      onPriceFilter({ min, max });
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedSkill(null);
    setPriceRange(null);
    onSearch('');
    onSkillFilter(null);
    onPriceFilter(null);
  };

  const hasActiveFilters = searchQuery || selectedSkill || priceRange;

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search interviewers..."
            value={searchQuery}
            onChange={handleSearch}
            className="pl-10"
          />
        </div>

        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="sm:w-auto"
        >
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Filters
          {hasActiveFilters && (
            <span className="ml-2 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
              {[searchQuery, selectedSkill, priceRange].filter(Boolean).length}
            </span>
          )}
        </Button>

        {hasActiveFilters && (
          <Button variant="ghost" onClick={clearFilters} size="sm">
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {showFilters && (
        <div className="flex flex-col sm:flex-row gap-4 p-4 bg-card rounded-lg border border-border/50 animate-fade-in">
          <div className="flex-1 space-y-2">
            <Label htmlFor="skill-filter">Skill</Label>
            <Select value={selectedSkill || 'all'} onValueChange={handleSkillChange}>
              <SelectTrigger id="skill-filter">
                <SelectValue placeholder="All Skills" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Skills</SelectItem>
                {skills.map((skill) => (
                  <SelectItem key={skill} value={skill}>
                    {skill}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 space-y-2">
            <Label htmlFor="price-filter">Price Range</Label>
            <Select value={priceRange || 'all'} onValueChange={handlePriceChange}>
              <SelectTrigger id="price-filter">
                <SelectValue placeholder="Any Price" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Price</SelectItem>
                <SelectItem value="0-50">Under ₹50/hr</SelectItem>
                <SelectItem value="50-100">₹50 - ₹100/hr</SelectItem>
                <SelectItem value="100-150">₹100 - ₹150/hr</SelectItem>
                <SelectItem value="150-999">₹150+/hr</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
}

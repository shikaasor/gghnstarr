import type { AudienceType, ContentFormat, TopicTag, WHORegion } from '@/lib/types';

interface EducationFiltersProps {
  audiences: AudienceType[];
  formats: ContentFormat[];
  topics: TopicTag[];
  years: number[];
  regions: WHORegion[];
  // Selected values (arrays for multi-select)
  selectedAudiences: AudienceType[];
  selectedFormats: ContentFormat[];
  selectedTopics: TopicTag[];
  selectedYears: number[];
  selectedRegions: WHORegion[];
  // Setters
  onAudienceChange: (v: AudienceType[]) => void;
  onFormatChange: (v: ContentFormat[]) => void;
  onTopicChange: (v: TopicTag[]) => void;
  onYearChange: (v: number[]) => void;
  onRegionChange: (v: WHORegion[]) => void;
  onClearAll: () => void;
}

function toggleValue<T>(current: T[], value: T): T[] {
  return current.includes(value)
    ? current.filter((v) => v !== value)
    : [...current, value];
}

export default function EducationFilters({
  audiences,
  formats,
  topics,
  years,
  regions,
  selectedAudiences,
  selectedFormats,
  selectedTopics,
  selectedYears,
  selectedRegions,
  onAudienceChange,
  onFormatChange,
  onTopicChange,
  onYearChange,
  onRegionChange,
  onClearAll,
}: EducationFiltersProps) {
  const hasActiveFilters =
    selectedAudiences.length > 0 ||
    selectedFormats.length > 0 ||
    selectedTopics.length > 0 ||
    selectedYears.length > 0 ||
    selectedRegions.length > 0;

  return (
    <div className="flex flex-col gap-4 mb-8">
      {/* Audience row */}
      {audiences.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Audience
          </span>
          <div className="flex flex-wrap gap-2">
            {audiences.map((audience) => (
              <button
                key={audience}
                onClick={() => onAudienceChange(toggleValue(selectedAudiences, audience))}
                className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                  selectedAudiences.includes(audience)
                    ? 'bg-teal-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {audience}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Format row */}
      {formats.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Format
          </span>
          <div className="flex flex-wrap gap-2">
            {formats.map((format) => (
              <button
                key={format}
                onClick={() => onFormatChange(toggleValue(selectedFormats, format))}
                className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                  selectedFormats.includes(format)
                    ? 'bg-teal-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {format}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Topic row */}
      {topics.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Topic
          </span>
          <div className="flex flex-wrap gap-2">
            {topics.map((topic) => (
              <button
                key={topic}
                onClick={() => onTopicChange(toggleValue(selectedTopics, topic))}
                className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                  selectedTopics.includes(topic)
                    ? 'bg-teal-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {topic}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Year row */}
      {years.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Year
          </span>
          <div className="flex flex-wrap gap-2">
            {years.map((year) => (
              <button
                key={year}
                onClick={() => onYearChange(toggleValue(selectedYears, year))}
                className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                  selectedYears.includes(year)
                    ? 'bg-teal-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Region row */}
      {regions.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Region
          </span>
          <div className="flex flex-wrap gap-2">
            {regions.map((region) => (
              <button
                key={region}
                onClick={() => onRegionChange(toggleValue(selectedRegions, region))}
                className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                  selectedRegions.includes(region)
                    ? 'bg-teal-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {region}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Clear filters */}
      {hasActiveFilters && (
        <button
          onClick={onClearAll}
          className="text-sm text-teal-700 underline w-fit"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}

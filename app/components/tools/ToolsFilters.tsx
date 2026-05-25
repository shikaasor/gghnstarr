import type { OHOrganizationLevel, OHAudienceType, OHScope } from '@/lib/types';

interface ToolsFiltersProps {
  // Available options
  organizationLevels: OHOrganizationLevel[];
  audienceTypes: OHAudienceType[];
  scopes: OHScope[];
  // Selected values (arrays for multi-select)
  selectedOrgLevels: OHOrganizationLevel[];
  selectedAudienceTypes: OHAudienceType[];
  selectedScopes: OHScope[];
  searchQuery: string;
  // Setters
  onOrgLevelChange: (v: OHOrganizationLevel[]) => void;
  onAudienceTypeChange: (v: OHAudienceType[]) => void;
  onScopeChange: (v: OHScope[]) => void;
  onSearchChange: (v: string) => void;
  onClearAll: () => void;
}

function toggleValue<T>(current: T[], value: T): T[] {
  return current.includes(value)
    ? current.filter((v) => v !== value)
    : [...current, value];
}

export default function ToolsFilters({
  organizationLevels,
  audienceTypes,
  scopes,
  selectedOrgLevels,
  selectedAudienceTypes,
  selectedScopes,
  searchQuery,
  onOrgLevelChange,
  onAudienceTypeChange,
  onScopeChange,
  onSearchChange,
  onClearAll,
}: ToolsFiltersProps) {
  const hasActiveFilters =
    selectedOrgLevels.length > 0 ||
    selectedAudienceTypes.length > 0 ||
    selectedScopes.length > 0 ||
    searchQuery !== '';

  return (
    <div className="flex flex-col gap-4 mb-8">
      {/* Search box */}
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search tools..."
        className="text-sm rounded border border-slate-200 px-3 py-2 w-full max-w-sm"
      />

      {/* Organization Level row */}
      {organizationLevels.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Organization Level
          </span>
          <div className="flex flex-wrap gap-2">
            {organizationLevels.map((level) => (
              <button
                key={level}
                onClick={() => onOrgLevelChange(toggleValue(selectedOrgLevels, level))}
                className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                  selectedOrgLevels.includes(level)
                    ? 'bg-teal-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Audience Type row */}
      {audienceTypes.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Audience Type
          </span>
          <div className="flex flex-wrap gap-2">
            {audienceTypes.map((audience) => (
              <button
                key={audience}
                onClick={() => onAudienceTypeChange(toggleValue(selectedAudienceTypes, audience))}
                className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                  selectedAudienceTypes.includes(audience)
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

      {/* Scope row */}
      {scopes.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Scope
          </span>
          <div className="flex flex-wrap gap-2">
            {scopes.map((scope) => (
              <button
                key={scope}
                onClick={() => onScopeChange(toggleValue(selectedScopes, scope))}
                className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                  selectedScopes.includes(scope)
                    ? 'bg-teal-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {scope}
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

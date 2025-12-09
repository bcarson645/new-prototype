'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function ConfirmMatchDetailsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const matchId = searchParams.get('matchId') || '42049073';
  const homeTeam = searchParams.get('homeTeam') || 'England';
  const awayTeam = searchParams.get('awayTeam') || 'India';
  const matchInfo = searchParams.get('matchInfo') || 'England v India';
  const homeTeamSquad = searchParams.get('homeTeamSquad') || 'lastUsed';
  const awayTeamSquad = searchParams.get('awayTeamSquad') || 'placeholder';

  const [activeTab, setActiveTab] = useState<'prematch' | 'live'>('prematch');
  
  // Confirm checkboxes
  const [confirmOptions, setConfirmOptions] = useState({
    series: false,
    grounds: false,
    dateTime: false,
    coverage: false,
  });

  // Modify values
  const [modifyValues, setModifyValues] = useState({
    series: 'T20 World Cup 2022',
    grounds: "Lord's Cricket Ground",
    dateTime: '2025-10-28',
    coverage: 'Live coverage',
  });

  const handleConfirmToggle = (key: keyof typeof confirmOptions) => {
    setConfirmOptions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSelectAll = () => {
    const allSelected = Object.values(confirmOptions).every((v) => v);
    setConfirmOptions({
      series: !allSelected,
      grounds: !allSelected,
      dateTime: !allSelected,
      coverage: !allSelected,
    });
  };

  const getSquadLabel = (squadType: string) => {
    if (squadType === 'tournamentPrepped') return 'Use Tournament Prepped Squad';
    if (squadType === 'lastUsed') return 'Use Last Used Squad';
    if (squadType === 'placeholder') return 'Use Placeholder Squad';
    if (squadType === 'manualSelect') return 'Manually Select Squad from Database';
    return '';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dark Blue Header */}
      <div className="bg-blue-900 text-white">
        <div className="w-full mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="text-xl font-semibold">sportradar</div>
              <div className="flex items-center gap-2 cursor-pointer hover:bg-blue-800 px-3 py-1 rounded">
                <span>PCS 1.0</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('prematch')}
                  className={`px-4 py-2 rounded font-medium ${
                    activeTab === 'prematch'
                      ? 'bg-blue-700 text-white'
                      : 'text-blue-200 hover:bg-blue-800'
                  }`}
                >
                  PREMATCH
                </button>
                <button
                  onClick={() => setActiveTab('live')}
                  className={`px-4 py-2 rounded font-medium ${
                    activeTab === 'live'
                      ? 'bg-blue-700 text-white'
                      : 'text-blue-200 hover:bg-blue-800'
                  }`}
                >
                  LIVE
                </button>
              </div>
              <div className="flex items-center gap-2 cursor-pointer hover:bg-blue-800 px-3 py-1 rounded">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>d.pavlica</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumbs */}
      <div className="bg-gray-200 border-b border-gray-300">
        <div className="w-full mx-auto px-6 py-2">
          <nav className="text-sm text-gray-700">
            <span className="hover:text-blue-600 cursor-pointer">PCS</span>
            <span className="mx-2">/</span>
            <span className="hover:text-blue-600 cursor-pointer">Match List</span>
            <span className="mx-2">/</span>
            <span className="text-gray-900">
              {matchInfo} ({matchId})
            </span>
          </nav>
        </div>
      </div>

      {/* Main Title */}
      <div className="bg-white border-b border-gray-200">
        <div className="w-full mx-auto px-6 py-2">
          <h1 className="text-3xl font-bold text-gray-900">Match setup</h1>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="bg-white border-b border-gray-200">
        <div className="w-full mx-auto px-6 py-3">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                1
              </div>
              <span className="font-medium text-blue-600">Select match</span>
            </button>
            <div className="flex-1 h-0.5 bg-blue-600"></div>
            <button
              onClick={() => {
                const params = new URLSearchParams();
                params.set('matchId', matchId);
                params.set('homeTeam', homeTeam);
                params.set('awayTeam', awayTeam);
                params.set('matchInfo', matchInfo);
                router.push(`/squad-setup?${params.toString()}`);
              }}
              className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                2
              </div>
              <span className="font-medium text-blue-600">Squad setup</span>
            </button>
            <div className="flex-1 h-0.5 bg-blue-600"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                3
              </div>
              <span className="font-medium text-blue-600">Confirm match details</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full mx-auto px-6 py-3">
        {/* Match Details Section */}
        <div className="mb-3">
          <h2 className="text-xl font-semibold text-blue-600 mb-2">Match details</h2>
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase">
                      <input type="checkbox" className="rounded" />
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase">
                      Start Date ↓
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase">
                      Match ID
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase">
                      Match info
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase">
                      Home team
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase">
                      Away team
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase">
                      Series
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase">
                      Competition Type
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase">
                      Format
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase">
                      Live Status
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase">
                      PreMatch Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-3 py-2">
                      <input type="checkbox" className="rounded" />
                    </td>
                    <td className="px-3 py-2 text-gray-900">28/10/2022 19:00</td>
                    <td className="px-3 py-2 text-gray-900">{matchId}</td>
                    <td className="px-3 py-2 text-gray-900">{matchInfo}</td>
                    <td className="px-3 py-2">
                      <div className="text-gray-900">{homeTeam}</div>
                      <select className="mt-0.5 text-xs border border-gray-300 rounded px-1.5 py-0.5">
                        <option>{getSquadLabel(homeTeamSquad)}</option>
                      </select>
                    </td>
                    <td className="px-3 py-2">
                      <div className="text-gray-900">{awayTeam}</div>
                      <select className="mt-0.5 text-xs border border-gray-300 rounded px-1.5 py-0.5">
                        <option>{getSquadLabel(awayTeamSquad)}</option>
                      </select>
                    </td>
                    <td className="px-3 py-2 text-gray-900">T20 World Cup 2022</td>
                    <td className="px-3 py-2 text-gray-900">ICC Tournament</td>
                    <td className="px-3 py-2 text-gray-900">T20I</td>
                    <td className="px-3 py-2">
                      <select className="border border-gray-300 rounded px-2 py-1 text-xs">
                        <option>CoverageConfirmed</option>
                      </select>
                    </td>
                    <td className="px-3 py-2">
                      <select className="border border-gray-300 rounded px-2 py-1 text-xs">
                        <option>CoverageConfirmed</option>
                      </select>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Confirm or Modify Match Details Section */}
        <div className="flex justify-center">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 max-w-2xl w-full">
            <h2 className="text-xl font-semibold text-blue-600 mb-3">Confirm or modify match details</h2>
            
            <div className="grid grid-cols-2 gap-8">
              {/* Confirm Column */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Confirm</h3>
                <div className="space-y-2">
                  <div className="flex items-end gap-2 h-[42px]">
                    <input
                      type="checkbox"
                      checked={confirmOptions.series}
                      onChange={() => handleConfirmToggle('series')}
                      className="rounded mb-0.5"
                    />
                    <span className="text-sm text-gray-700">Series</span>
                  </div>
                  <div className="flex items-end gap-2 h-[42px]">
                    <input
                      type="checkbox"
                      checked={confirmOptions.grounds}
                      onChange={() => handleConfirmToggle('grounds')}
                      className="rounded mb-0.5"
                    />
                    <span className="text-sm text-gray-700">Grounds</span>
                  </div>
                  <div className="flex items-end gap-2 h-[42px]">
                    <input
                      type="checkbox"
                      checked={confirmOptions.dateTime}
                      onChange={() => handleConfirmToggle('dateTime')}
                      className="rounded mb-0.5"
                    />
                    <span className="text-sm text-gray-700">Date & time</span>
                  </div>
                  <div className="flex items-end gap-2 h-[42px]">
                    <input
                      type="checkbox"
                      checked={confirmOptions.coverage}
                      onChange={() => handleConfirmToggle('coverage')}
                      className="rounded mb-0.5"
                    />
                    <span className="text-sm text-gray-700">Coverage</span>
                  </div>
                </div>
              </div>

            {/* Modify Column */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Modify</h3>
              <div className="space-y-2">
                <div>
                  <label className="block text-xs text-gray-600 mb-0.5">Series</label>
                  <select
                    value={modifyValues.series}
                    onChange={(e) => setModifyValues({ ...modifyValues, series: e.target.value })}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                  >
                    <option>T20 World Cup 2022</option>
                    <option>ICC Champions Trophy 2025</option>
                    <option>ODI Series 2025</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-0.5">Grounds</label>
                  <select
                    value={modifyValues.grounds}
                    onChange={(e) => setModifyValues({ ...modifyValues, grounds: e.target.value })}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                  >
                    <option>Lord's Cricket Ground</option>
                    <option>Melbourne Cricket Ground</option>
                    <option>Eden Gardens</option>
                    <option>The Oval</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-0.5">Date & time</label>
                  <div className="relative">
                    <input
                      type="date"
                      value={modifyValues.dateTime}
                      onChange={(e) => setModifyValues({ ...modifyValues, dateTime: e.target.value })}
                      className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                    />
                    <svg
                      className="absolute right-2 top-1.5 w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-0.5">Coverage</label>
                  <select
                    value={modifyValues.coverage}
                    onChange={(e) => setModifyValues({ ...modifyValues, coverage: e.target.value })}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                  >
                    <option>Live coverage</option>
                    <option>Pre-match coverage</option>
                    <option>No coverage</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex justify-center gap-4">
          <button
            onClick={handleSelectAll}
            className="px-8 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium text-lg"
          >
            Select all
          </button>
          <button
            onClick={() => {
              const params = new URLSearchParams();
              params.set('matchId', matchId);
              params.set('homeTeam', homeTeam);
              params.set('awayTeam', awayTeam);
              params.set('matchInfo', matchInfo);
              params.set('homeTeamSquad', homeTeamSquad);
              params.set('awayTeamSquad', awayTeamSquad);
              
              // Pass player data forward
              const homeTeamStarting = searchParams.get('homeTeamStarting');
              const homeTeamReserves = searchParams.get('homeTeamReserves');
              const awayTeamStarting = searchParams.get('awayTeamStarting');
              const awayTeamReserves = searchParams.get('awayTeamReserves');
              
              if (homeTeamStarting) params.set('homeTeamStarting', homeTeamStarting);
              if (homeTeamReserves) params.set('homeTeamReserves', homeTeamReserves);
              if (awayTeamStarting) params.set('awayTeamStarting', awayTeamStarting);
              if (awayTeamReserves) params.set('awayTeamReserves', awayTeamReserves);
              
              // Pass match details (date, series, ground) forward
              params.set('matchDate', modifyValues.dateTime);
              params.set('matchSeries', modifyValues.series);
              params.set('matchGround', modifyValues.grounds);
              
              router.push(`/match-details?${params.toString()}`);
            }}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-lg"
          >
            Confirm match details
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ConfirmMatchDetails() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
      <ConfirmMatchDetailsContent />
    </Suspense>
  );
}


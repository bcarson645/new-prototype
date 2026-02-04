'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Match {
  id: string;
  startDate: string;
  matchId: string;
  matchInfo: string;
  homeTeam: string;
  awayTeam: string;
  series: string;
  competitionType: string;
  format: string;
  liveStatus: string;
  preMatchStatus: string;
}

const sampleMatches: Match[] = [
  {
    id: '1',
    startDate: '19/02/2025 14:00',
    matchId: '42048024',
    matchInfo: 'Pakistan v New Zealand',
    homeTeam: 'Pakistan',
    awayTeam: 'New Zealand',
    series: 'ICC Champions Trophy 2025',
    competitionType: 'International',
    format: 'ODI',
    liveStatus: 'CoverageConfirmed',
    preMatchStatus: 'CoverageConfirmed',
  },
  {
    id: '2',
    startDate: '21/02/2025 14:00',
    matchId: '42058391',
    matchInfo: 'Pakistan v Bangladesh',
    homeTeam: 'Pakistan',
    awayTeam: 'Bangladesh',
    series: 'ICC Champions Trophy 2025',
    competitionType: 'International',
    format: 'Test (5 Days)',
    liveStatus: 'CoverageConfirmed',
    preMatchStatus: 'CoverageConfirmed',
  },
  {
    id: '3',
    startDate: '22/02/2025 14:00',
    matchId: '42049732',
    matchInfo: 'Australia v England',
    homeTeam: 'Australia',
    awayTeam: 'England',
    series: 'ICC Champions Trophy 2025',
    competitionType: 'International',
    format: 'T20I',
    liveStatus: 'CoverageConfirmed',
    preMatchStatus: 'CoverageConfirmed',
  },
  {
    id: '4',
    startDate: '23/02/2025 14:00',
    matchId: '42058392',
    matchInfo: 'India v South Africa',
    homeTeam: 'India',
    awayTeam: 'South Africa',
    series: 'ODI Series 2025',
    competitionType: 'International',
    format: 'ODI',
    liveStatus: 'CoverageConfirmed',
    preMatchStatus: 'CoverageConfirmed',
  },
  {
    id: '5',
    startDate: '24/02/2025 14:00',
    matchId: '42058393',
    matchInfo: 'West Indies v Sri Lanka',
    homeTeam: 'West Indies',
    awayTeam: 'Sri Lanka',
    series: 'T20 World Cup 2022',
    competitionType: 'International',
    format: 'T20I',
    liveStatus: 'Live',
    preMatchStatus: 'CoverageConfirmed',
  },
  {
    id: '6',
    startDate: '25/02/2025 14:00',
    matchId: '42058394',
    matchInfo: 'England v New Zealand',
    homeTeam: 'England',
    awayTeam: 'New Zealand',
    series: 'T20 Blast (T20)',
    competitionType: 'Domestic',
    format: 'T20',
    liveStatus: 'Live',
    preMatchStatus: 'CoverageConfirmed',
  },
  {
    id: '7',
    startDate: '26/02/2025 14:00',
    matchId: '42058395',
    matchInfo: 'Australia v India',
    homeTeam: 'Australia',
    awayTeam: 'India',
    series: 'ICC Champions Trophy 2025',
    competitionType: 'International',
    format: 'ODI',
    liveStatus: 'Live',
    preMatchStatus: 'CoverageConfirmed',
  },
  {
    id: '8',
    startDate: '27/02/2025 14:00',
    matchId: '42058396',
    matchInfo: 'Bangladesh v South Africa',
    homeTeam: 'Bangladesh',
    awayTeam: 'South Africa',
    series: 'ODI Series 2025',
    competitionType: 'International',
    format: 'ODI',
    liveStatus: 'CoverageConfirmed',
    preMatchStatus: 'CoverageConfirmed',
  },
  {
    id: '9',
    startDate: '28/02/2025 14:00',
    matchId: '42058397',
    matchInfo: 'Pakistan v England',
    homeTeam: 'Pakistan',
    awayTeam: 'England',
    series: 'ICC Champions Trophy 2025',
    competitionType: 'International',
    format: 'Test (5 Days)',
    liveStatus: 'CoverageConfirmed',
    preMatchStatus: 'CoverageConfirmed',
  },
  {
    id: '10',
    startDate: '01/03/2025 14:00',
    matchId: '42058398',
    matchInfo: 'New Zealand v India',
    homeTeam: 'New Zealand',
    awayTeam: 'India',
    series: 'T20 World Cup 2022',
    competitionType: 'International',
    format: 'T20I',
    liveStatus: 'CoverageConfirmed',
    preMatchStatus: 'CoverageConfirmed',
  },
];

export default function Home() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'prematch' | 'live'>('prematch');
  const [selectedMatches, setSelectedMatches] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const matchesPerPage = 10;
  const [traderNames, setTraderNames] = useState<Record<string, string>>({});
  const [prepStatus, setPrepStatus] = useState<Record<string, number>>({});
  
  // Get published matches from localStorage
  const [publishedMatches, setPublishedMatches] = useState<Set<string>>(new Set());
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('publishedMatches');
      setPublishedMatches(new Set(stored ? JSON.parse(stored) : []));
    }
  }, []);
  
  const isMatchPublished = (matchId: string) => {
    return publishedMatches.has(matchId);
  };

  const toggleMatchSelection = (matchId: string) => {
    const newSelected = new Set(selectedMatches);
    if (newSelected.has(matchId)) {
      newSelected.delete(matchId);
    } else {
      newSelected.add(matchId);
    }
    setSelectedMatches(newSelected);
  };

  const isMatchSelected = (matchId: string) => {
    return selectedMatches.has(matchId);
  };

  const getPrepStatusColor = (score: number) => {
    switch (score) {
      case 5:
        return 'bg-green-600 text-white border-green-700';
      case 4:
        return 'bg-green-400 text-white border-green-500';
      case 3:
        return 'bg-yellow-400 text-gray-900 border-yellow-500';
      case 2:
        return 'bg-orange-400 text-white border-orange-500';
      case 1:
        return 'bg-red-500 text-white border-red-600';
      default:
        return 'bg-gray-200 text-gray-700 border-gray-300';
    }
  };

  const handleTraderChange = (matchId: string, value: string) => {
    setTraderNames(prev => ({
      ...prev,
      [matchId]: value
    }));
  };

  const handlePrepStatusChange = (matchId: string, value: number) => {
    setPrepStatus(prev => ({
      ...prev,
      [matchId]: value
    }));
  };

  // Separate matches into pre-match and live
  const preMatchMatches = sampleMatches.filter((match) => match.liveStatus !== 'Live');
  const liveMatches = sampleMatches.filter((match) => match.liveStatus === 'Live');

  // Get current match list based on active tab
  const currentMatchList = activeTab === 'prematch' ? preMatchMatches : liveMatches;

  const filteredMatches = currentMatchList.filter((match) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      match.matchId.includes(query) ||
      match.startDate.includes(query) ||
      match.matchInfo.toLowerCase().includes(query) ||
      match.homeTeam.toLowerCase().includes(query) ||
      match.awayTeam.toLowerCase().includes(query) ||
      match.series.toLowerCase().includes(query)
    );
  });

  const totalPages = Math.ceil(filteredMatches.length / matchesPerPage);
  const startIndex = (currentPage - 1) * matchesPerPage;
  const paginatedMatches = filteredMatches.slice(startIndex, startIndex + matchesPerPage);

  const handleConfirm = () => {
    if (selectedMatches.size === 0) return;
    // Get the first selected match by matchId
    const selectedMatchId = Array.from(selectedMatches)[0];
    const selectedMatch = currentMatchList.find((m) => m.matchId === selectedMatchId);
    if (selectedMatch) {
      // Navigate to squad setup page with match data
      router.push(`/squad-setup?matchId=${selectedMatch.matchId}&homeTeam=${encodeURIComponent(selectedMatch.homeTeam)}&awayTeam=${encodeURIComponent(selectedMatch.awayTeam)}&matchInfo=${encodeURIComponent(selectedMatch.matchInfo)}`);
    }
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
              <div className="flex items-center gap-2 cursor-pointer hover:bg-blue-800 px-3 py-1 rounded">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>b.carson</span>
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
          </nav>
        </div>
      </div>

      {/* Pre Match / Live Tabs Sub-Banner */}
      <div className="bg-white border-b border-gray-300">
        <div className="w-full mx-auto px-6">
          <div className="flex gap-1 border-b border-gray-200">
            <button
              onClick={() => {
                setActiveTab('prematch');
                setCurrentPage(1);
                setSelectedMatches(new Set());
              }}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'prematch'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Pre Match
            </button>
            <button
              onClick={() => {
                setActiveTab('live');
                setCurrentPage(1);
                setSelectedMatches(new Set());
              }}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'live'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Live
            </button>
          </div>
        </div>
      </div>

      {/* Main Title */}
      <div className="bg-white border-b border-gray-200">
        <div className="w-full mx-auto px-6 py-4">
          <h1 className="text-3xl font-bold text-gray-900">Match setup</h1>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="bg-white border-b border-gray-200">
        <div className="w-full mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                1
              </div>
              <span className="font-medium text-gray-900">Select match</span>
            </div>
            <div className="flex-1 h-0.5 bg-gray-300"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-semibold">
                2
              </div>
              <span className="font-medium text-gray-500">Squad setup</span>
            </div>
            <div className="flex-1 h-0.5 bg-gray-300"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-semibold">
                3
              </div>
              <span className="font-medium text-gray-500">Confirm match details</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full mx-auto px-6 py-6">
        <h2 className="text-xl font-semibold text-blue-600 mb-4">Select match</h2>

        {/* Search Bar */}
        <div className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search by ID, date, tournament, match or team name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
              Search
            </button>
          </div>
          <div className="mt-2 flex items-center gap-1 text-sm text-gray-600">
            <span>Or use filters (below)</span>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        {/* Filter Row */}
        <div className="mb-6 grid grid-cols-9 gap-2">
          <select className="px-3 py-2 border border-gray-300 rounded text-sm">
            <option>Pick date</option>
          </select>
          <select className="px-3 py-2 border border-gray-300 rounded text-sm">
            <option>Select</option>
          </select>
          <select className="px-3 py-2 border border-gray-300 rounded text-sm">
            <option>Filter by match info</option>
          </select>
          <select className="px-3 py-2 border border-gray-300 rounded text-sm">
            <option>Filter home team</option>
          </select>
          <select className="px-3 py-2 border border-gray-300 rounded text-sm">
            <option>Filter away team</option>
          </select>
          <select className="px-3 py-2 border border-gray-300 rounded text-sm">
            <option>Select series</option>
          </select>
          <select className="px-3 py-2 border border-gray-300 rounded text-sm">
            <option>Select</option>
          </select>
          <select className="px-3 py-2 border border-gray-300 rounded text-sm">
            <option>Value x</option>
          </select>
          <select className="px-3 py-2 border border-gray-300 rounded text-sm">
            <option>Select</option>
          </select>
        </div>

        {/* Match Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
            <table className="w-full min-w-full">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    <input type="checkbox" className="rounded" />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Start Date ↓
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Match ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Match info
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Home team
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Away team
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Series
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Competition Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Format
                  </th>
                  {activeTab === 'live' ? (
                    <>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Trader
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Prep Status
                      </th>
                    </>
                  ) : (
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      PreMatch Status
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedMatches.map((match) => (
                  <tr
                    key={match.id}
                    className={`hover:bg-gray-50 ${
                      isMatchSelected(match.matchId) ? 'bg-blue-50' : ''
                    }`}
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={isMatchSelected(match.matchId)}
                        onChange={() => toggleMatchSelection(match.matchId)}
                        className="rounded"
                      />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {match.startDate}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {match.matchId}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center gap-2">
                        <span>{match.matchInfo}</span>
                        {isMatchPublished(match.matchId) && (
                          <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs font-semibold rounded">
                            Published
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {match.homeTeam}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {match.awayTeam}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {match.series}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {match.competitionType}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <select
                        className="border border-gray-300 rounded px-2 py-1 text-sm"
                        defaultValue={match.format}
                      >
                        <option>{match.format}</option>
                      </select>
                    </td>
                    {activeTab === 'live' ? (
                      <>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          <input
                            type="text"
                            value={traderNames[match.matchId] && traderNames[match.matchId].trim() ? traderNames[match.matchId] : 'unassigned'}
                            onChange={(e) => {
                              const value = e.target.value === 'unassigned' ? '' : e.target.value;
                              handleTraderChange(match.matchId, value);
                            }}
                            onFocus={(e) => {
                              if (e.target.value === 'unassigned') {
                                e.target.select();
                              }
                            }}
                            className={`px-2 py-1 rounded text-sm border w-full ${
                              traderNames[match.matchId] && traderNames[match.matchId].trim()
                                ? 'bg-green-100 border-green-400 text-green-800'
                                : 'bg-red-100 border-red-400 text-red-800'
                            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                          />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          <select
                            value={prepStatus[match.matchId] || ''}
                            onChange={(e) => handlePrepStatusChange(match.matchId, parseInt(e.target.value))}
                            className={`px-2 py-1 rounded text-sm font-semibold border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                              prepStatus[match.matchId]
                                ? getPrepStatusColor(prepStatus[match.matchId])
                                : 'bg-gray-200 border-gray-300 text-gray-700'
                            }`}
                          >
                            <option value="" className="bg-gray-200 text-gray-700">Select</option>
                            <option value="1" className="bg-red-500 text-white">1</option>
                            <option value="2" className="bg-orange-400 text-white">2</option>
                            <option value="3" className="bg-yellow-400 text-gray-900">3</option>
                            <option value="4" className="bg-green-400 text-white">4</option>
                            <option value="5" className="bg-green-600 text-white">5</option>
                          </select>
                        </td>
                      </>
                    ) : (
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <select
                          className="border border-gray-300 rounded px-2 py-1 text-sm"
                          defaultValue={match.preMatchStatus}
                        >
                          <option>{match.preMatchStatus}</option>
                        </select>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination and Confirm Button */}
          <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200">
            <button
              onClick={handleConfirm}
              disabled={selectedMatches.size === 0}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirm Selection
            </button>
            <div className="flex-1 flex justify-end items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                &lt;
              </button>
              <span className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                &gt;
              </button>
              <button className="ml-4 w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-xs font-medium">
                R
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

interface MarketRow {
  id: string;
  marketId: string;
  selection: string;
  line: number;
  above: number;
  below: number;
  adjust: number;
  priceAbove: number;
  priceBelow: string;
  published: boolean;
}

function PlayerStatsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const matchId = searchParams.get('matchId') || '';
  const homeTeam = searchParams.get('homeTeam') || 'England';
  const awayTeam = searchParams.get('awayTeam') || 'India';
  const matchInfo = searchParams.get('matchInfo') || `${homeTeam} v ${awayTeam}`;

  // Confirmation dialog state
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Collapsible sections state
  const [expandedSections, setExpandedSections] = useState({
    general: true,
    preMatch: false,
    groups: false,
    marketConfig: false,
  });

  // Active TR level state
  const [activeTR, setActiveTR] = useState<number | null>(null);

  // Sample data for General Markets
  const [generalMarkets, setGeneralMarkets] = useState<MarketRow[]>([
    {
      id: '1',
      marketId: 'Match Betting',
      selection: homeTeam,
      line: 0.5,
      above: 0.376,
      below: 0.007,
      adjust: 1.00,
      priceAbove: 0.376,
      priceBelow: 'n/a',
      published: false,
    },
    {
      id: '2',
      marketId: 'Match Betting',
      selection: awayTeam,
      line: 0.5,
      above: 0.376,
      below: 0.007,
      adjust: 1.00,
      priceAbove: 0.376,
      priceBelow: 'n/a',
      published: false,
    },
    {
      id: '3',
      marketId: 'Match Betting',
      selection: 'Both',
      line: 0.5,
      above: 0.376,
      below: 0.007,
      adjust: 1.00,
      priceAbove: 0.376,
      priceBelow: 'n/a',
      published: false,
    },
    {
      id: '4',
      marketId: 'Match Winner Double Chance',
      selection: `${homeTeam} / Draw`,
      line: 0.5,
      above: 0.376,
      below: 0.007,
      adjust: 1.00,
      priceAbove: 0.376,
      priceBelow: '0.007',
      published: false,
    },
    {
      id: '5',
      marketId: 'Match Winner Double Chance',
      selection: `${awayTeam} / Draw`,
      line: 0.5,
      above: 0.376,
      below: 0.007,
      adjust: 1.00,
      priceAbove: 0.376,
      priceBelow: 'n/a',
      published: false,
    },
    {
      id: '6',
      marketId: 'Draw No Bet',
      selection: homeTeam,
      line: 0.5,
      above: 0.376,
      below: 0.007,
      adjust: 1.00,
      priceAbove: 0.376,
      priceBelow: '0.007',
      published: false,
    },
    {
      id: '7',
      marketId: 'Draw No Bet',
      selection: awayTeam,
      line: 0.5,
      above: 0.376,
      below: 0.007,
      adjust: 1.00,
      priceAbove: 0.376,
      priceBelow: '0.007',
      published: false,
    },
    {
      id: '8',
      marketId: 'Tied Match',
      selection: 'Yes',
      line: 0.5,
      above: 0.376,
      below: 0.007,
      adjust: 1.00,
      priceAbove: 0.376,
      priceBelow: 'n/a',
      published: false,
    },
    {
      id: '9',
      marketId: 'Tied Match',
      selection: 'No',
      line: 0.5,
      above: 0.376,
      below: 0.007,
      adjust: 1.00,
      priceAbove: 0.376,
      priceBelow: 'n/a',
      published: false,
    },
    {
      id: '10',
      marketId: 'Toss Winner',
      selection: homeTeam,
      line: 0.5,
      above: 0.376,
      below: 0.007,
      adjust: 1.00,
      priceAbove: 0.376,
      priceBelow: 'n/a',
      published: false,
    },
    {
      id: '11',
      marketId: 'Toss Winner',
      selection: awayTeam,
      line: 0.5,
      above: 0.376,
      below: 0.007,
      adjust: 1.00,
      priceAbove: 0.376,
      priceBelow: 'n/a',
      published: false,
    },
    {
      id: '12',
      marketId: 'Toss/Win Double',
      selection: 'None',
      line: 0.5,
      above: 0.376,
      below: 0.007,
      adjust: 1.00,
      priceAbove: 0.376,
      priceBelow: 'n/a',
      published: false,
    },
    {
      id: '13',
      marketId: '1st Innings Team of Top Bat',
      selection: homeTeam,
      line: 0.5,
      above: 0.376,
      below: 0.007,
      adjust: 1.00,
      priceAbove: 0.376,
      priceBelow: 'n/a',
      published: false,
    },
    {
      id: '14',
      marketId: '1st Innings Team of Top Bat',
      selection: awayTeam,
      line: 0.5,
      above: 0.376,
      below: 0.007,
      adjust: 1.00,
      priceAbove: 0.376,
      priceBelow: 'n/a',
      published: false,
    },
    {
      id: '15',
      marketId: '1st Innings Team of Top Bowl',
      selection: homeTeam,
      line: 0.5,
      above: 0.376,
      below: 0.007,
      adjust: 1.00,
      priceAbove: 0.376,
      priceBelow: 'n/a',
      published: false,
    },
    {
      id: '16',
      marketId: '1st Innings Team of Top Bowl',
      selection: awayTeam,
      line: 0.5,
      above: 0.376,
      below: 0.007,
      adjust: 1.00,
      priceAbove: 0.376,
      priceBelow: 'n/a',
      published: false,
    },
    {
      id: '17',
      marketId: 'First Innings Lead',
      selection: homeTeam,
      line: 0.5,
      above: 0.376,
      below: 0.007,
      adjust: 1.00,
      priceAbove: 0.376,
      priceBelow: 'n/a',
      published: false,
    },
    {
      id: '18',
      marketId: 'First Innings Lead',
      selection: awayTeam,
      line: 0.5,
      above: 0.376,
      below: 0.007,
      adjust: 1.00,
      priceAbove: 0.376,
      priceBelow: 'n/a',
      published: false,
    },
    {
      id: '19',
      marketId: 'First Innings Lead',
      selection: 'Tie',
      line: 0.5,
      above: 0.376,
      below: 0.007,
      adjust: 1.00,
      priceAbove: 0.376,
      priceBelow: 'n/a',
      published: false,
    },
    {
      id: '20',
      marketId: 'Fifty in First Innings',
      selection: 'Yes',
      line: 0.5,
      above: 0.376,
      below: 0.007,
      adjust: 1.00,
      priceAbove: 0.376,
      priceBelow: 'n/a',
      published: false,
    },
    {
      id: '21',
      marketId: 'Fifty in First Innings',
      selection: 'No',
      line: 0.5,
      above: 0.376,
      below: 0.007,
      adjust: 1.00,
      priceAbove: 0.376,
      priceBelow: 'n/a',
      published: false,
    },
    {
      id: '22',
      marketId: 'Hundred in First Innings',
      selection: 'Yes',
      line: 0.5,
      above: 0.376,
      below: 0.007,
      adjust: 1.00,
      priceAbove: 0.376,
      priceBelow: 'n/a',
      published: false,
    },
    {
      id: '23',
      marketId: 'Hundred in First Innings',
      selection: 'No',
      line: 0.5,
      above: 0.376,
      below: 0.007,
      adjust: 1.00,
      priceAbove: 0.376,
      priceBelow: 'n/a',
      published: false,
    },
    {
      id: '24',
      marketId: 'Fifty in Match',
      selection: 'Yes',
      line: 0.5,
      above: 0.376,
      below: 0.007,
      adjust: 1.00,
      priceAbove: 0.376,
      priceBelow: 'n/a',
      published: false,
    },
    {
      id: '25',
      marketId: 'Fifty in Match',
      selection: 'No',
      line: 0.5,
      above: 0.376,
      below: 0.007,
      adjust: 1.00,
      priceAbove: 0.376,
      priceBelow: 'n/a',
      published: false,
    },
    {
      id: '26',
      marketId: 'Hundred in Match',
      selection: 'Yes',
      line: 0.5,
      above: 0.376,
      below: 0.007,
      adjust: 1.00,
      priceAbove: 0.376,
      priceBelow: 'n/a',
      published: false,
    },
    {
      id: '27',
      marketId: 'Hundred in Match',
      selection: 'No',
      line: 0.5,
      above: 0.376,
      below: 0.007,
      adjust: 1.00,
      priceAbove: 0.376,
      priceBelow: 'n/a',
      published: false,
    },
    {
      id: '28',
      marketId: 'Man of the Match',
      selection: 'Selection',
      line: 0.5,
      above: 0.376,
      below: 0.007,
      adjust: 1.00,
      priceAbove: 0.376,
      priceBelow: 'n/a',
      published: false,
    },
  ]);

  // Pre-Match / Players Markets
  const [preMatchMarkets, setPreMatchMarkets] = useState<MarketRow[]>([
    {
      id: 'p1',
      marketId: '1st Innings Runs',
      selection: 'All batters',
      line: 0.5,
      above: 0.376,
      below: 0.007,
      adjust: 1.00,
      priceAbove: 0.376,
      priceBelow: 'n/a',
      published: true,
    },
    {
      id: 'p2',
      marketId: '1st Innings Fours',
      selection: 'All batters',
      line: 0.5,
      above: 0.376,
      below: 0.007,
      adjust: 1.00,
      priceAbove: 0.376,
      priceBelow: 'n/a',
      published: true,
    },
    {
      id: 'p3',
      marketId: '1st Innings Sixes',
      selection: 'All batters',
      line: 0.5,
      above: 0.376,
      below: 0.007,
      adjust: 1.00,
      priceAbove: 0.376,
      priceBelow: 'n/a',
      published: true,
    },
    {
      id: 'p4',
      marketId: 'To Score 50 in',
      selection: 'Yes / No (all batters)',
      line: 0.5,
      above: 0.376,
      below: 0.007,
      adjust: 1.00,
      priceAbove: 0.376,
      priceBelow: 'n/a',
      published: true,
    },
    {
      id: 'p5',
      marketId: 'To Score 100 in',
      selection: 'Yes / No (all batters)',
      line: 0.5,
      above: 0.376,
      below: 0.007,
      adjust: 1.00,
      priceAbove: 0.376,
      priceBelow: 'n/a',
      published: false,
    },
    {
      id: 'p6',
      marketId: '1st Innings Wickets',
      selection: 'Yes / No (all batters)',
      line: 0.5,
      above: 0.376,
      below: 0.007,
      adjust: 1.00,
      priceAbove: 0.376,
      priceBelow: 'n/a',
      published: false,
    },
    {
      id: 'p7',
      marketId: '1st Innings Player Perf',
      selection: 'Yes / No (all batters)',
      line: 0.5,
      above: 0.376,
      below: 0.007,
      adjust: 1.00,
      priceAbove: 0.376,
      priceBelow: 'n/a',
      published: false,
    },
    {
      id: 'p8',
      marketId: '1st Innings Runs Conceded',
      selection: 'Yes / No (all batters)',
      line: 0.5,
      above: 0.376,
      below: 0.007,
      adjust: 1.00,
      priceAbove: 0.376,
      priceBelow: 'n/a',
      published: false,
    },
    {
      id: 'p9',
      marketId: 'Balls Faced',
      selection: '',
      line: 0.5,
      above: 0.376,
      below: 0.007,
      adjust: 1.00,
      priceAbove: 0.376,
      priceBelow: 'n/a',
      published: false,
    },
    {
      id: 'p10',
      marketId: 'Batsman Match Bet I-V (First Innings Only)',
      selection: '',
      line: 0.5,
      above: 0.376,
      below: 0.007,
      adjust: 1.00,
      priceAbove: 0.376,
      priceBelow: 'n/a',
      published: false,
    },
    {
      id: 'p11',
      marketId: 'Batsman Head to Head (Home/Away)',
      selection: '',
      line: 0.5,
      above: 0.376,
      below: 0.007,
      adjust: 1.00,
      priceAbove: 0.376,
      priceBelow: 'n/a',
      published: false,
    },
    {
      id: 'p12',
      marketId: 'Race to 10 Runs',
      selection: '',
      line: 0.5,
      above: 0.376,
      below: 0.007,
      adjust: 1.00,
      priceAbove: 0.376,
      priceBelow: 'n/a',
      published: false,
    },
    {
      id: 'p13',
      marketId: 'Combo Bets (Runs & Wickets)',
      selection: '',
      line: 0.5,
      above: 0.376,
      below: 0.007,
      adjust: 1.00,
      priceAbove: 0.376,
      priceBelow: 'n/a',
      published: false,
    },
    {
      id: 'p14',
      marketId: 'Player Combo 2 / 3-way',
      selection: '',
      line: 0.5,
      above: 0.376,
      below: 0.007,
      adjust: 1.00,
      priceAbove: 0.376,
      priceBelow: 'n/a',
      published: false,
    },
  ]);

  // Groups Markets
  const [groupMarkets, setGroupMarkets] = useState<MarketRow[]>([
    {
      id: 'g1',
      marketId: 'England 1st Over Runs - 5 Ball',
      selection: '',
      line: 0.5,
      above: 0.376,
      below: 0.007,
      adjust: 1.00,
      priceAbove: 0.376,
      priceBelow: 'n/a',
      published: false,
    },
    {
      id: 'g2',
      marketId: 'England 1st Over Runs - 5 Ball',
      selection: 'Alternative Runs',
      line: 0.5,
      above: 0.376,
      below: 0.007,
      adjust: 1.00,
      priceAbove: 0.376,
      priceBelow: 'n/a',
      published: false,
    },
    {
      id: 'g3',
      marketId: 'England 2nd Over Runs - 5 Ball',
      selection: '',
      line: 0.5,
      above: 0.376,
      below: 0.007,
      adjust: 1.00,
      priceAbove: 0.376,
      priceBelow: 'n/a',
      published: false,
    },
    {
      id: 'g4',
      marketId: 'England 2nd Over Runs - 5 Ball',
      selection: 'Alternative Runs',
      line: 0.5,
      above: 0.376,
      below: 0.007,
      adjust: 1.00,
      priceAbove: 0.376,
      priceBelow: 'n/a',
      published: false,
    },
    {
      id: 'g5',
      marketId: 'England 3rd Over Runs - 5 Ball',
      selection: '',
      line: 0.5,
      above: 0.376,
      below: 0.007,
      adjust: 1.00,
      priceAbove: 0.376,
      priceBelow: 'n/a',
      published: false,
    },
    {
      id: 'g6',
      marketId: 'England 3rd Over Runs - 5 Ball',
      selection: 'Alternative Runs',
      line: 0.5,
      above: 0.376,
      below: 0.007,
      adjust: 1.00,
      priceAbove: 0.376,
      priceBelow: 'n/a',
      published: false,
    },
    {
      id: 'g7',
      marketId: 'England 4th Over Runs - 5 Ball',
      selection: '',
      line: 0.5,
      above: 0.376,
      below: 0.007,
      adjust: 1.00,
      priceAbove: 0.376,
      priceBelow: 'n/a',
      published: false,
    },
    {
      id: 'g8',
      marketId: 'England 4th Over Runs - 5 Ball',
      selection: 'Alternative Runs',
      line: 0.5,
      above: 0.376,
      below: 0.007,
      adjust: 1.00,
      priceAbove: 0.376,
      priceBelow: 'n/a',
      published: false,
    },
    {
      id: 'g9',
      marketId: 'England 5th Over Runs - 5 Ball',
      selection: '',
      line: 0.5,
      above: 0.376,
      below: 0.007,
      adjust: 1.00,
      priceAbove: 0.376,
      priceBelow: 'n/a',
      published: false,
    },
    {
      id: 'g10',
      marketId: 'England 5th Over Runs - 5 Ball',
      selection: 'Alternative Runs',
      line: 0.5,
      above: 0.376,
      below: 0.007,
      adjust: 1.00,
      priceAbove: 0.376,
      priceBelow: 'n/a',
      published: false,
    },
  ]);

  // TR Configuration - defined after all state variables, using useMemo to recalculate when markets change
  const trConfig = useMemo(() => [
    { level: 1, general: 10, players: 3, groups: 2 },
    { level: 2, general: 14, players: 6, groups: 4 },
    { level: 3, general: 20, players: 10, groups: 6 },
    { level: 4, general: 25, players: 12, groups: 8 },
    { level: 5, general: generalMarkets.length, players: preMatchMarkets.length, groups: groupMarkets.length },
  ], [generalMarkets.length, preMatchMarkets.length, groupMarkets.length]);

  // Function to activate markets based on TR level
  const activateTR = (trLevel: number) => {
    const config = trConfig[trLevel - 1];
    
    // Activate General Markets (top down)
    setGeneralMarkets(prev => 
      prev.map((row, index) => ({
        ...row,
        published: index < config.general
      }))
    );

    // Activate Pre-Match / Players Markets (top down)
    setPreMatchMarkets(prev =>
      prev.map((row, index) => ({
        ...row,
        published: index < config.players
      }))
    );

    // Activate Groups Markets (top down)
    setGroupMarkets(prev =>
      prev.map((row, index) => ({
        ...row,
        published: index < config.groups
      }))
    );

    setActiveTR(trLevel);
  };

  const toggleSection = (section: 'general' | 'preMatch' | 'groups') => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Helper function to group markets by Market ID
  const groupMarketsByMarketId = (markets: MarketRow[]) => {
    const groups: { marketId: string; rows: MarketRow[] }[] = [];
    let currentGroup: { marketId: string; rows: MarketRow[] } | null = null;

    markets.forEach((row) => {
      if (!currentGroup || currentGroup.marketId !== row.marketId) {
        currentGroup = { marketId: row.marketId, rows: [] };
        groups.push(currentGroup);
      }
      currentGroup.rows.push(row);
    });

    return groups;
  };

  // Helper function to toggle all rows in a market group
  const toggleMarketGroup = (marketId: string, section: 'general' | 'preMatch' | 'groups') => {
    if (section === 'general') {
      setGeneralMarkets(prev => {
        const firstRow = prev.find(r => r.marketId === marketId);
        const newPublishedState = !firstRow?.published;
        return prev.map(row => (row.marketId === marketId ? { ...row, published: newPublishedState } : row));
      });
    } else if (section === 'preMatch') {
      setPreMatchMarkets(prev => {
        const firstRow = prev.find(r => r.marketId === marketId);
        const newPublishedState = !firstRow?.published;
        return prev.map(row => (row.marketId === marketId ? { ...row, published: newPublishedState } : row));
      });
    } else {
      setGroupMarkets(prev => {
        const firstRow = prev.find(r => r.marketId === marketId);
        const newPublishedState = !firstRow?.published;
        return prev.map(row => (row.marketId === marketId ? { ...row, published: newPublishedState } : row));
      });
    }
  };

  // Helper to get published state for a market group (use first row's state)
  const getMarketGroupPublished = (marketId: string, markets: MarketRow[]) => {
    const firstRow = markets.find(r => r.marketId === marketId);
    return firstRow?.published || false;
  };

  const togglePublished = (id: string, section: 'general' | 'preMatch' | 'groups' = 'general') => {
    if (section === 'general') {
      setGeneralMarkets(prev =>
        prev.map(row => (row.id === id ? { ...row, published: !row.published } : row))
      );
    } else if (section === 'preMatch') {
      setPreMatchMarkets(prev =>
        prev.map(row => (row.id === id ? { ...row, published: !row.published } : row))
      );
    } else {
      setGroupMarkets(prev =>
        prev.map(row => (row.id === id ? { ...row, published: !row.published } : row))
      );
    }
  };

  const updateRowValue = (id: string, field: keyof MarketRow, value: number | string, section: 'general' | 'preMatch' | 'groups' = 'general') => {
    if (section === 'general') {
      setGeneralMarkets(prev =>
        prev.map(row => (row.id === id ? { ...row, [field]: value } : row))
      );
    } else if (section === 'preMatch') {
      setPreMatchMarkets(prev =>
        prev.map(row => (row.id === id ? { ...row, [field]: value } : row))
      );
    } else {
      setGroupMarkets(prev =>
        prev.map(row => (row.id === id ? { ...row, [field]: value } : row))
      );
    }
  };

  // Calculate active market counts by type
  const getActiveMarketCounts = () => {
    const matchActive = generalMarkets.filter(m => m.published).length;
    const playersActive = preMatchMarkets.filter(m => m.published).length;
    const groupsActive = groupMarkets.filter(m => m.published).length;
    
    return {
      match: { total: generalMarkets.length, active: matchActive },
      players: { total: preMatchMarkets.length, active: playersActive },
      groups: { total: groupMarkets.length, active: groupsActive },
    };
  };

  const marketCounts = getActiveMarketCounts();

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Dark Blue Header */}
      <div className="bg-blue-900 text-white flex-shrink-0">
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
      <div className="bg-gray-200 border-b border-gray-300 flex-shrink-0">
        <div className="w-full mx-auto px-6 py-2">
          <nav className="text-sm text-gray-700">
            <span className="hover:text-blue-600 cursor-pointer">PCS</span>
            <span className="mx-2">/</span>
            <span className="hover:text-blue-600 cursor-pointer">Match List</span>
            <span className="mx-2">/</span>
            <span className="text-gray-900">
              {matchInfo} ({matchId})
            </span>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Markets</span>
          </nav>
        </div>
      </div>

      {/* Main Content - 2 Column Layout */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Column - 25% width */}
        <div className="w-[25%] bg-white border-r border-gray-200 flex flex-col overflow-hidden relative">
          {/* Market Type Summary Table */}
          <div className="bg-white border-b border-gray-200 flex-shrink-0">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-800">Market Type</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-800">Active</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-3 text-gray-900">Match</td>
                  <td className="px-4 py-3 text-gray-900 font-semibold">
                    {marketCounts.match.active} / {marketCounts.match.total}
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-gray-900">Players</td>
                  <td className="px-4 py-3 text-gray-900 font-semibold">
                    {marketCounts.players.active} / {marketCounts.players.total}
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-gray-900">Groups</td>
                  <td className="px-4 py-3 text-gray-900 font-semibold">
                    {marketCounts.groups.active} / {marketCounts.groups.total}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          {/* Market Configuration Table */}
          <div className="border-t border-gray-200 mt-4">
            <button
              onClick={() => setExpandedSections(prev => ({ ...prev, marketConfig: !prev.marketConfig }))}
              className="w-full bg-gray-100 hover:bg-gray-200 px-4 py-2 flex items-center justify-between text-left font-semibold text-gray-800 text-sm"
            >
              <span>Market Configuration</span>
              <svg
                className={`w-5 h-5 transition-transform ${expandedSections.marketConfig ? 'rotate-90' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Tournament Ranking Selection */}
          <div className="border-t border-gray-200 mt-4 px-4 py-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">Tournament Ranking</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-600">TR Level</span>
                <span className={`text-sm font-semibold px-2 py-1 rounded ${
                  activeTR 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {activeTR ? `TR ${activeTR}` : 'Not Set'}
                </span>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((trLevel) => (
                  <button
                    key={trLevel}
                    onClick={() => activateTR(trLevel)}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-all ${
                      activeTR === trLevel
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {trLevel}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Publish Markets Button */}
          <div className="mt-6 px-4 pb-4">
            <button
              onClick={() => setShowConfirmDialog(true)}
              className="w-full px-6 py-4 bg-blue-600 text-white text-base font-semibold rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-all shadow-md hover:shadow-lg"
            >
              Publish Markets
            </button>
          </div>
        </div>
        
        {/* Right Column - 75% width */}
        <div className="w-[75%] bg-white overflow-auto">
          <div className="p-6">
            {/* Collapsible Sections */}
            <div className="space-y-4">
              {/* General Markets Section */}
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection('general')}
                  className="w-full bg-gray-100 hover:bg-gray-200 px-4 py-3 flex items-center justify-between text-left font-semibold text-gray-800"
                >
                  <span>General Markets</span>
                  <svg
                    className={`w-5 h-5 transition-transform ${expandedSections.general ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {expandedSections.general && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-800 text-white">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold">Market ID</th>
                          <th className="px-4 py-3 text-left font-semibold">Selection</th>
                          <th className="px-4 py-3 text-left font-semibold">Line</th>
                          <th className="px-4 py-3 text-left font-semibold">Above</th>
                          <th className="px-4 py-3 text-left font-semibold">Below</th>
                          <th className="px-4 py-3 text-left font-semibold">Adjust</th>
                          <th className="px-4 py-3 text-left font-semibold">Price above</th>
                          <th className="px-4 py-3 text-left font-semibold">Price below</th>
                          <th className="px-4 py-3 text-left font-semibold">Active</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {groupMarketsByMarketId(generalMarkets).map((group, groupIndex) => (
                          group.rows.map((row, rowIndex) => {
                            const isFirstRow = rowIndex === 0;
                            const isEvenGroup = groupIndex % 2 === 0;
                            const groupBgClass = isEvenGroup ? 'bg-white' : 'bg-gray-50';
                            return (
                              <tr key={row.id} className={`hover:bg-gray-100 ${groupBgClass}`}>
                                <td className="px-4 py-3 text-gray-900 font-semibold">
                                  {isFirstRow ? row.marketId : ''}
                                </td>
                                <td className="px-4 py-3 text-gray-900">{row.selection}</td>
                                <td className="px-4 py-3 text-gray-900">
                              {row.line.toFixed(1)}
                            </td>
                            <td className="px-4 py-3">
                              <div className="bg-green-100 text-green-800 px-3 py-1 rounded text-center font-semibold inline-block">
                                {row.above.toFixed(3)}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="bg-red-100 text-red-800 px-3 py-1 rounded text-center font-semibold inline-block">
                                {row.below.toFixed(3)}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <input
                                type="number"
                                step="0.01"
                                value={row.adjust}
                                onChange={(e) => updateRowValue(row.id, 'adjust', parseFloat(e.target.value) || 0, 'general')}
                                className="w-20 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-1 focus:ring-blue-400"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <div className="bg-green-100 text-green-800 px-3 py-1 rounded text-center font-semibold inline-block">
                                {row.priceAbove.toFixed(3)}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="bg-red-100 text-red-800 px-3 py-1 rounded text-center font-semibold inline-block">
                                {row.priceBelow}
                              </div>
                            </td>
                                <td className="px-4 py-3">
                                  {isFirstRow ? (
                                    <button
                                      onClick={() => toggleMarketGroup(row.marketId, 'general')}
                                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                        getMarketGroupPublished(row.marketId, generalMarkets) ? 'bg-blue-600' : 'bg-gray-300'
                                      }`}
                                    >
                                      <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                          getMarketGroupPublished(row.marketId, generalMarkets) ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                      />
                                    </button>
                                  ) : (
                                    <span></span>
                                  )}
                                </td>
                              </tr>
                            );
                          })
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Pre-Match / Players Section */}
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection('preMatch')}
                  className="w-full bg-gray-100 hover:bg-gray-200 px-4 py-3 flex items-center justify-between text-left font-semibold text-gray-800"
                >
                  <span>Pre-Match / Players</span>
                  <svg
                    className={`w-5 h-5 transition-transform ${expandedSections.preMatch ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {expandedSections.preMatch && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-800 text-white">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold">Market ID</th>
                          <th className="px-4 py-3 text-left font-semibold">Selection</th>
                          <th className="px-4 py-3 text-left font-semibold">Line</th>
                          <th className="px-4 py-3 text-left font-semibold">Above</th>
                          <th className="px-4 py-3 text-left font-semibold">Below</th>
                          <th className="px-4 py-3 text-left font-semibold">Adjust</th>
                          <th className="px-4 py-3 text-left font-semibold">Price above</th>
                          <th className="px-4 py-3 text-left font-semibold">Price below</th>
                          <th className="px-4 py-3 text-left font-semibold">Active</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {groupMarketsByMarketId(preMatchMarkets).map((group, groupIndex) => (
                          group.rows.map((row, rowIndex) => {
                            const isFirstRow = rowIndex === 0;
                            const isEvenGroup = groupIndex % 2 === 0;
                            const groupBgClass = isEvenGroup ? 'bg-white' : 'bg-gray-50';
                            return (
                              <tr key={row.id} className={`hover:bg-gray-100 ${groupBgClass}`}>
                                <td className="px-4 py-3 text-gray-900 font-semibold">
                                  {isFirstRow ? row.marketId : ''}
                                </td>
                                <td className="px-4 py-3 text-gray-900">{row.selection}</td>
                            <td className="px-4 py-3 text-gray-900">
                              {row.line.toFixed(1)}
                            </td>
                            <td className="px-4 py-3">
                              <div className="bg-green-100 text-green-800 px-3 py-1 rounded text-center font-semibold inline-block">
                                {row.above.toFixed(3)}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="bg-red-100 text-red-800 px-3 py-1 rounded text-center font-semibold inline-block">
                                {row.below.toFixed(3)}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <input
                                type="number"
                                step="0.01"
                                value={row.adjust}
                                onChange={(e) => updateRowValue(row.id, 'adjust', parseFloat(e.target.value) || 0, 'preMatch')}
                                className="w-20 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-1 focus:ring-blue-400"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <div className="bg-green-100 text-green-800 px-3 py-1 rounded text-center font-semibold inline-block">
                                {row.priceAbove.toFixed(3)}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="bg-red-100 text-red-800 px-3 py-1 rounded text-center font-semibold inline-block">
                                {row.priceBelow}
                              </div>
                            </td>
                                <td className="px-4 py-3">
                                  {isFirstRow ? (
                                    <button
                                      onClick={() => toggleMarketGroup(row.marketId, 'preMatch')}
                                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                        getMarketGroupPublished(row.marketId, preMatchMarkets) ? 'bg-blue-600' : 'bg-gray-300'
                                      }`}
                                    >
                                      <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                          getMarketGroupPublished(row.marketId, preMatchMarkets) ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                      />
                                    </button>
                                  ) : (
                                    <span></span>
                                  )}
                                </td>
                              </tr>
                            );
                          })
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Groups Section */}
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection('groups')}
                  className="w-full bg-gray-100 hover:bg-gray-200 px-4 py-3 flex items-center justify-between text-left font-semibold text-gray-800"
                >
                  <span>Groups</span>
                  <svg
                    className={`w-5 h-5 transition-transform ${expandedSections.groups ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {expandedSections.groups && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-800 text-white">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold">Market ID</th>
                          <th className="px-4 py-3 text-left font-semibold">Selection</th>
                          <th className="px-4 py-3 text-left font-semibold">Line</th>
                          <th className="px-4 py-3 text-left font-semibold">Above</th>
                          <th className="px-4 py-3 text-left font-semibold">Below</th>
                          <th className="px-4 py-3 text-left font-semibold">Adjust</th>
                          <th className="px-4 py-3 text-left font-semibold">Price above</th>
                          <th className="px-4 py-3 text-left font-semibold">Price below</th>
                          <th className="px-4 py-3 text-left font-semibold">Active</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {groupMarketsByMarketId(groupMarkets).map((group, groupIndex) => (
                          group.rows.map((row, rowIndex) => {
                            const isFirstRow = rowIndex === 0;
                            const isEvenGroup = groupIndex % 2 === 0;
                            const groupBgClass = isEvenGroup ? 'bg-white' : 'bg-gray-50';
                            return (
                              <tr key={row.id} className={`hover:bg-gray-100 ${groupBgClass}`}>
                                <td className="px-4 py-3 text-gray-900 font-semibold">
                                  {isFirstRow ? row.marketId : ''}
                                </td>
                                <td className="px-4 py-3 text-gray-900">{row.selection}</td>
                                <td className="px-4 py-3 text-gray-900">
                                  {row.line.toFixed(1)}
                                </td>
                                <td className="px-4 py-3">
                                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded text-center font-semibold inline-block">
                                    {row.above.toFixed(3)}
                                  </div>
                                </td>
                                <td className="px-4 py-3">
                                  <div className="bg-red-100 text-red-800 px-3 py-1 rounded text-center font-semibold inline-block">
                                    {row.below.toFixed(3)}
                                  </div>
                                </td>
                                <td className="px-4 py-3">
                                  <input
                                    type="number"
                                    step="0.01"
                                    value={row.adjust}
                                    onChange={(e) => updateRowValue(row.id, 'adjust', parseFloat(e.target.value) || 0, 'groups')}
                                    className="w-20 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-1 focus:ring-blue-400"
                                  />
                                </td>
                                <td className="px-4 py-3">
                                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded text-center font-semibold inline-block">
                                    {row.priceAbove.toFixed(3)}
                                  </div>
                                </td>
                                <td className="px-4 py-3">
                                  <div className="bg-red-100 text-red-800 px-3 py-1 rounded text-center font-semibold inline-block">
                                    {row.priceBelow}
                                  </div>
                                </td>
                                <td className="px-4 py-3">
                                  {isFirstRow ? (
                                    <button
                                      onClick={() => toggleMarketGroup(row.marketId, 'groups')}
                                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                        getMarketGroupPublished(row.marketId, groupMarkets) ? 'bg-blue-600' : 'bg-gray-300'
                                      }`}
                                    >
                                      <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                          getMarketGroupPublished(row.marketId, groupMarkets) ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                      />
                                    </button>
                                  ) : (
                                    <span></span>
                                  )}
                                </td>
                              </tr>
                            );
                          })
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Market Configuration Panel - Slides out from the right edge of left column */}
        {expandedSections.marketConfig ? (
        <div 
          className="absolute top-0 bg-white border-l border-gray-200 shadow-2xl z-[100] transition-all duration-300 ease-in-out h-full translate-x-0" 
          style={{ width: '400px', left: '25%' }}
        >
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-800">Market Configuration</h3>
              <button
                onClick={() => setExpandedSections(prev => ({ ...prev, marketConfig: false }))}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold text-gray-800 text-xs">TR</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-800 text-xs">General</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-800 text-xs">PM/Players</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-800 text-xs">Groups</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-800 text-xs">Active</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {trConfig.map((tr) => (
                    <tr key={tr.level} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-gray-900 font-medium">TR{tr.level}</td>
                      <td className="px-4 py-2 text-gray-900">{tr.general}</td>
                      <td className="px-4 py-2 text-gray-900">{tr.players}</td>
                      <td className="px-4 py-2 text-gray-900">{tr.groups}</td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => activateTR(tr.level)}
                          className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                            activeTR === tr.level
                              ? 'bg-blue-600 text-white hover:bg-blue-700'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          {activeTR === tr.level ? 'Active' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        ) : null}
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Publish Markets</h3>
            <p className="text-gray-700 mb-6">
              Are you sure you wish to publish markets to live? This action will make the markets available for live betting.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Store published status in localStorage or navigate with query param
                  const publishedMatches = JSON.parse(localStorage.getItem('publishedMatches') || '[]');
                  if (!publishedMatches.includes(matchId)) {
                    publishedMatches.push(matchId);
                    localStorage.setItem('publishedMatches', JSON.stringify(publishedMatches));
                  }
                  router.push('/');
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Confirm Publish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PlayerStatsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PlayerStatsContent />
    </Suspense>
  );
}


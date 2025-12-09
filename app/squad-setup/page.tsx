'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

interface Player {
  id: string;
  number: number;
  name: string;
  style: string;
  role: string;
}

// Sample player data for different squad types
const englandLastUsedSquad: Player[] = [
  { id: '1', number: 1, name: 'Z Crawley', style: 'RHB', role: 'Batter' },
  { id: '2', number: 2, name: 'BM Duckett', style: 'LHB', role: 'Batter' },
  { id: '3', number: 3, name: 'OJ Pope', style: 'RHB', role: 'Batter' },
  { id: '4', number: 4, name: 'JE Root', style: 'LHB', role: 'Batter' },
  { id: '5', number: 5, name: 'HC Brook', style: 'RHB', role: 'Batter' },
  { id: '6', number: 6, name: 'BA Stokes', style: 'LHB', role: 'All-Rounder' },
  { id: '7', number: 7, name: 'JL Smith', style: 'RHB', role: 'Keeper' },
  { id: '8', number: 8, name: 'LA Dawson', style: 'RHB', role: 'All-Rounder' },
  { id: '9', number: 9, name: 'CR Woakes', style: 'RHB', role: 'Bowler' },
  { id: '10', number: 10, name: 'BA Carse', style: 'RHB', role: 'Bowler' },
  { id: '11', number: 11, name: 'JC Archer', style: 'LHB', role: 'Bowler' },
  { id: '12', number: 12, name: 'JG Bethell', style: 'RHB', role: 'Batter' },
  { id: '13', number: 13, name: 'AAP Atkinson', style: 'LHB', role: 'Batter' },
  { id: '14', number: 14, name: 'J Overton', style: 'RHB', role: 'Keeper' },
  { id: '15', number: 15, name: 'JC Tongue', style: 'RHB', role: 'All-Rounder' },
  { id: '16', number: 16, name: 'JE Root', style: 'LHB', role: 'Bowler' },
];

const indiaTournamentPreppedSquad: Player[] = [
  { id: '1', number: 1, name: 'YBK Jaiswal', style: 'LHB', role: 'Batter' },
  { id: '2', number: 2, name: 'KL Rahul', style: 'RHB', role: 'Batter' },
  { id: '3', number: 3, name: 'V Kohli', style: 'RHB', role: 'Batter' },
  { id: '4', number: 4, name: 'Shubman Gill', style: 'RHB', role: 'Batter' },
  { id: '5', number: 5, name: 'RR Pant', style: 'LHB', role: 'Keeper' },
  { id: '6', number: 6, name: 'RA Jadeja', style: 'LHB', role: 'All-Rounder' },
  { id: '7', number: 7, name: 'HH Pandya', style: 'RHB', role: 'All-Rounder' },
  { id: '8', number: 8, name: 'R Ashwin', style: 'RHB', role: 'Bowler' },
  { id: '9', number: 9, name: 'JJ Bumrah', style: 'RHB', role: 'Bowler' },
  { id: '10', number: 10, name: 'Mohammed Shami', style: 'RHB', role: 'Bowler' },
  { id: '11', number: 11, name: 'Mohammed Siraj', style: 'RHB', role: 'Bowler' },
  { id: '12', number: 12, name: 'Ishan Kishan', style: 'LHB', role: 'Keeper' },
  { id: '13', number: 13, name: 'Y Chahal', style: 'RHB', role: 'Bowler' },
  { id: '14', number: 14, name: 'SN Thakur', style: 'RHB', role: 'All-Rounder' },
  { id: '15', number: 15, name: 'Washington Sundar', style: 'LHB', role: 'All-Rounder' },
  { id: '16', number: 16, name: 'A Kamboj', style: 'RHB', role: 'Bowler' },
];

const indiaLastUsedSquad: Player[] = [
  { id: '1', number: 1, name: 'YBK Jaiswal', style: 'LHB', role: 'Batter' },
  { id: '2', number: 2, name: 'Rohit Sharma', style: 'RHB', role: 'Batter' },
  { id: '3', number: 3, name: 'V Kohli', style: 'RHB', role: 'Batter' },
  { id: '4', number: 4, name: 'Shubman Gill', style: 'RHB', role: 'Batter' },
  { id: '5', number: 5, name: 'RR Pant', style: 'LHB', role: 'Keeper' },
  { id: '6', number: 6, name: 'RA Jadeja', style: 'LHB', role: 'All-Rounder' },
  { id: '7', number: 7, name: 'HH Pandya', style: 'RHB', role: 'All-Rounder' },
  { id: '8', number: 8, name: 'R Ashwin', style: 'RHB', role: 'Bowler' },
  { id: '9', number: 9, name: 'JJ Bumrah', style: 'RHB', role: 'Bowler' },
  { id: '10', number: 10, name: 'Mohammed Shami', style: 'RHB', role: 'Bowler' },
  { id: '11', number: 11, name: 'Mohammed Siraj', style: 'RHB', role: 'Bowler' },
  { id: '12', number: 12, name: 'Ishan Kishan', style: 'LHB', role: 'Keeper' },
  { id: '13', number: 13, name: 'Y Chahal', style: 'RHB', role: 'Bowler' },
  { id: '14', number: 14, name: 'SN Thakur', style: 'RHB', role: 'All-Rounder' },
  { id: '15', number: 15, name: 'Washington Sundar', style: 'LHB', role: 'All-Rounder' },
  { id: '16', number: 16, name: 'A Kamboj', style: 'RHB', role: 'Bowler' },
];

const australiaTournamentPreppedSquad: Player[] = [
  { id: '1', number: 1, name: 'DA Warner', style: 'LHB', role: 'Batter' },
  { id: '2', number: 2, name: 'UT Khawaja', style: 'LHB', role: 'Batter' },
  { id: '3', number: 3, name: 'M Labuschagne', style: 'RHB', role: 'Batter' },
  { id: '4', number: 4, name: 'SPD Smith', style: 'RHB', role: 'Batter' },
  { id: '5', number: 5, name: 'TM Head', style: 'LHB', role: 'Batter' },
  { id: '6', number: 6, name: 'C Green', style: 'RHB', role: 'All-Rounder' },
  { id: '7', number: 7, name: 'AT Carey', style: 'LHB', role: 'Keeper' },
  { id: '8', number: 8, name: 'PJ Cummins', style: 'RHB', role: 'Bowler' },
  { id: '9', number: 9, name: 'MA Starc', style: 'LHB', role: 'Bowler' },
  { id: '10', number: 10, name: 'NM Lyon', style: 'RHB', role: 'Bowler' },
  { id: '11', number: 11, name: 'JR Hazlewood', style: 'RHB', role: 'Bowler' },
  { id: '12', number: 12, name: 'MP Stoinis', style: 'RHB', role: 'All-Rounder' },
  { id: '13', number: 13, name: 'GJ Maxwell', style: 'RHB', role: 'All-Rounder' },
  { id: '14', number: 14, name: 'TD Paine', style: 'RHB', role: 'Keeper' },
  { id: '15', number: 15, name: 'SM Boland', style: 'RHB', role: 'Bowler' },
  { id: '16', number: 16, name: 'CJ Ferguson', style: 'RHB', role: 'Bowler' },
];

const australiaLastUsedSquad: Player[] = [
  { id: '1', number: 1, name: 'DA Warner', style: 'LHB', role: 'Batter' },
  { id: '2', number: 2, name: 'UT Khawaja', style: 'LHB', role: 'Batter' },
  { id: '3', number: 3, name: 'M Labuschagne', style: 'RHB', role: 'Batter' },
  { id: '4', number: 4, name: 'SPD Smith', style: 'RHB', role: 'Batter' },
  { id: '5', number: 5, name: 'TM Head', style: 'LHB', role: 'Batter' },
  { id: '6', number: 6, name: 'C Green', style: 'RHB', role: 'All-Rounder' },
  { id: '7', number: 7, name: 'AT Carey', style: 'LHB', role: 'Keeper' },
  { id: '8', number: 8, name: 'PJ Cummins', style: 'RHB', role: 'Bowler' },
  { id: '9', number: 9, name: 'MA Starc', style: 'LHB', role: 'Bowler' },
  { id: '10', number: 10, name: 'NM Lyon', style: 'RHB', role: 'Bowler' },
  { id: '11', number: 11, name: 'JR Hazlewood', style: 'RHB', role: 'Bowler' },
  { id: '12', number: 12, name: 'MP Stoinis', style: 'RHB', role: 'All-Rounder' },
  { id: '13', number: 13, name: 'GJ Maxwell', style: 'RHB', role: 'All-Rounder' },
  { id: '14', number: 14, name: 'TD Paine', style: 'RHB', role: 'Keeper' },
  { id: '15', number: 15, name: 'SM Boland', style: 'RHB', role: 'Bowler' },
  { id: '16', number: 16, name: 'CJ Ferguson', style: 'RHB', role: 'Bowler' },
];

const englandTournamentPreppedSquad: Player[] = [
  { id: '1', number: 1, name: 'Z Crawley', style: 'RHB', role: 'Batter' },
  { id: '2', number: 2, name: 'BM Duckett', style: 'LHB', role: 'Batter' },
  { id: '3', number: 3, name: 'OJ Pope', style: 'RHB', role: 'Batter' },
  { id: '4', number: 4, name: 'JE Root', style: 'LHB', role: 'Batter' },
  { id: '5', number: 5, name: 'HC Brook', style: 'RHB', role: 'Batter' },
  { id: '6', number: 6, name: 'BA Stokes', style: 'LHB', role: 'All-Rounder' },
  { id: '7', number: 7, name: 'JL Smith', style: 'RHB', role: 'Keeper' },
  { id: '8', number: 8, name: 'LA Dawson', style: 'RHB', role: 'All-Rounder' },
  { id: '9', number: 9, name: 'CR Woakes', style: 'RHB', role: 'Bowler' },
  { id: '10', number: 10, name: 'BA Carse', style: 'RHB', role: 'Bowler' },
  { id: '11', number: 11, name: 'JC Archer', style: 'LHB', role: 'Bowler' },
  { id: '12', number: 12, name: 'JG Bethell', style: 'RHB', role: 'Batter' },
  { id: '13', number: 13, name: 'AAP Atkinson', style: 'LHB', role: 'Batter' },
  { id: '14', number: 14, name: 'J Overton', style: 'RHB', role: 'Keeper' },
  { id: '15', number: 15, name: 'JC Tongue', style: 'RHB', role: 'All-Rounder' },
  { id: '16', number: 16, name: 'JE Root', style: 'LHB', role: 'Bowler' },
];

function getSquadData(team: string, squadType: string): Player[] {
  if (team === 'England') {
    if (squadType === 'lastUsed') return englandLastUsedSquad;
    if (squadType === 'tournamentPrepped') return englandTournamentPreppedSquad;
  }
  if (team === 'Australia') {
    if (squadType === 'lastUsed') return australiaLastUsedSquad;
    if (squadType === 'tournamentPrepped') return australiaTournamentPreppedSquad;
  }
  if (team === 'India') {
    if (squadType === 'lastUsed') return indiaLastUsedSquad;
    if (squadType === 'tournamentPrepped') return indiaTournamentPreppedSquad;
  }
  // Default fallback - return empty array or placeholder
  return [];
}

function SquadSetupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const matchId = searchParams.get('matchId') || '42049732';
  const homeTeam = searchParams.get('homeTeam') || 'Australia';
  const awayTeam = searchParams.get('awayTeam') || 'England';
  const matchInfo = searchParams.get('matchInfo') || 'Australia v England';

  const [activeTab, setActiveTab] = useState<'prematch' | 'live'>('prematch');
  
  // Track which toggle is active for each team
  const [homeTeamActiveToggle, setHomeTeamActiveToggle] = useState<string | null>(null);
  const [awayTeamActiveToggle, setAwayTeamActiveToggle] = useState<string | null>(null);
  
  // Player lists for each team
  const [homeTeamPlayers, setHomeTeamPlayers] = useState<Player[]>([]);
  const [awayTeamPlayers, setAwayTeamPlayers] = useState<Player[]>([]);
  
  // Track dragged player
  const [draggedPlayer, setDraggedPlayer] = useState<{ player: Player; team: string; sourceList: 'starting' | 'reserves' } | null>(null);
  
  // Track selected player for arrow-based swap
  const [selectedPlayerForSwap, setSelectedPlayerForSwap] = useState<{ player: Player; team: string; list: 'starting' | 'reserves' } | null>(null);

  const toggleHomeTeam = (key: string) => {
    if (homeTeamActiveToggle === key) {
      // If clicking the same toggle, turn it off
      setHomeTeamActiveToggle(null);
      setHomeTeamPlayers([]);
    } else {
      // Turn on the selected toggle and turn off others
      setHomeTeamActiveToggle(key);
      const squadType = key === 'tournamentPrepped' ? 'tournamentPrepped' : 
                       key === 'lastUsed' ? 'lastUsed' : 
                       key === 'placeholder' ? 'placeholder' : 'manualSelect';
      const players = getSquadData(homeTeam, squadType);
      setHomeTeamPlayers(players.map(p => ({ ...p }))); // Create a copy
    }
  };

  const toggleAwayTeam = (key: string) => {
    if (awayTeamActiveToggle === key) {
      // If clicking the same toggle, turn it off
      setAwayTeamActiveToggle(null);
      setAwayTeamPlayers([]);
    } else {
      // Turn on the selected toggle and turn off others
      setAwayTeamActiveToggle(key);
      const squadType = key === 'tournamentPrepped' ? 'tournamentPrepped' : 
                       key === 'lastUsed' ? 'lastUsed' : 
                       key === 'placeholder' ? 'placeholder' : 'manualSelect';
      const players = getSquadData(awayTeam, squadType);
      setAwayTeamPlayers(players.map(p => ({ ...p }))); // Create a copy
    }
  };

  const getStartingXI = (players: Player[]) => players.slice(0, 11);
  const getReserves = (players: Player[]) => players.slice(11);

  const handleDragStart = (player: Player, team: string, sourceList: 'starting' | 'reserves') => {
    setDraggedPlayer({ player, team, sourceList });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number, targetList: 'starting' | 'reserves', team: string) => {
    e.preventDefault();
    if (!draggedPlayer || draggedPlayer.team !== team) return;

    const players = team === homeTeam ? [...homeTeamPlayers] : [...awayTeamPlayers];
    const setPlayers = team === homeTeam ? setHomeTeamPlayers : setAwayTeamPlayers;

    const startingXI = [...getStartingXI(players)];
    const reserves = [...getReserves(players)];

    // Find the dragged player
    const sourceList = draggedPlayer.sourceList === 'starting' ? startingXI : reserves;
    const sourceIndex = sourceList.findIndex(p => p.id === draggedPlayer.player.id);
    if (sourceIndex === -1) return;

    // Get target list
    const targetListArray = targetList === 'starting' ? startingXI : reserves;

    // If moving within the same list
    if (draggedPlayer.sourceList === targetList) {
      // Create a new array to avoid mutation issues
      const newArray = [...targetListArray];
      const [removed] = newArray.splice(sourceIndex, 1);
      
      // Adjust target index if dragging forward (down the list)
      let insertIndex = targetIndex;
      if (sourceIndex < targetIndex) {
        insertIndex = targetIndex; // After removal, targetIndex is already correct
      }
      
      newArray.splice(insertIndex, 0, removed);
      
      // Update the appropriate list
      if (targetList === 'starting') {
        const newStarting = newArray.slice(0, 11);
        const newReserves = [...newArray.slice(11), ...reserves].slice(0, 5);
        setPlayers([...newStarting, ...newReserves]);
      } else {
        const newStarting = startingXI.slice(0, 11);
        const newReserves = newArray.slice(0, 5);
        setPlayers([...newStarting, ...newReserves]);
      }
    } else {
      // Moving between different lists
      const [removedPlayer] = sourceList.splice(sourceIndex, 1);
      targetListArray.splice(targetIndex, 0, removedPlayer);
      
      // Recombine: always 11 in starting, rest in reserves
      const newStarting = startingXI.slice(0, 11);
      const newReserves = [...startingXI.slice(11), ...reserves].slice(0, 5);
      setPlayers([...newStarting, ...newReserves]);
    }
    
    setDraggedPlayer(null);
  };

  const handleDragEnd = () => {
    setDraggedPlayer(null);
  };

  const handleArrowClick = (player: Player, team: string, list: 'starting' | 'reserves') => {
    if (!selectedPlayerForSwap) {
      // First player selected for swap
      setSelectedPlayerForSwap({ player, team, list });
    } else {
      // Second player selected - perform swap
      if (selectedPlayerForSwap.team === team) {
        const players = team === homeTeam ? [...homeTeamPlayers] : [...awayTeamPlayers];
        const startingXI = [...getStartingXI(players)];
        const reserves = [...getReserves(players)];
        
        if (selectedPlayerForSwap.list === list) {
          // Swap within same list
          const targetList = list === 'starting' ? startingXI : reserves;
          const firstIndex = targetList.findIndex(p => p.id === selectedPlayerForSwap.player.id);
          const secondIndex = targetList.findIndex(p => p.id === player.id);
          
          if (firstIndex !== -1 && secondIndex !== -1) {
            // Swap positions
            [targetList[firstIndex], targetList[secondIndex]] = [targetList[secondIndex], targetList[firstIndex]];
            
            // Recombine and update
            const newPlayers = list === 'starting' 
              ? [...targetList, ...reserves]
              : [...startingXI, ...targetList];
            
            if (team === homeTeam) {
              setHomeTeamPlayers(newPlayers);
            } else {
              setAwayTeamPlayers(newPlayers);
            }
          }
        } else {
          // Swap between different lists (starting <-> reserves)
          const firstList = selectedPlayerForSwap.list === 'starting' ? startingXI : reserves;
          const secondList = list === 'starting' ? startingXI : reserves;
          
          const firstIndex = firstList.findIndex(p => p.id === selectedPlayerForSwap.player.id);
          const secondIndex = secondList.findIndex(p => p.id === player.id);
          
          if (firstIndex !== -1 && secondIndex !== -1) {
            // Swap players between lists
            const [removedFromFirst] = firstList.splice(firstIndex, 1);
            const [removedFromSecond] = secondList.splice(secondIndex, 1);
            
            firstList.splice(firstIndex, 0, removedFromSecond);
            secondList.splice(secondIndex, 0, removedFromFirst);
            
            // Ensure starting XI has exactly 11 players
            const newStarting = startingXI.slice(0, 11);
            const newReserves = [...startingXI.slice(11), ...reserves].slice(0, 5);
            const newPlayers = [...newStarting, ...newReserves];
            
            if (team === homeTeam) {
              setHomeTeamPlayers(newPlayers);
            } else {
              setAwayTeamPlayers(newPlayers);
            }
          }
        }
      }
      setSelectedPlayerForSwap(null);
    }
  };

  const renderPlayerTable = (players: Player[], team: string, listType: 'starting' | 'reserves') => {
    const listPlayers = listType === 'starting' ? getStartingXI(players) : getReserves(players);
    const title = listType === 'starting' ? 'Starting XI' : 'Reserves';

    return (
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">{title}</h4>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Sort</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">No.</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Player name</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Style</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Role</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {listPlayers.map((player, index) => {
                const isSelected = selectedPlayerForSwap?.player.id === player.id && selectedPlayerForSwap?.team === team && selectedPlayerForSwap?.list === listType;
                return (
                  <tr
                    key={`${listType}-${player.id}-${index}`}
                    draggable
                    onDragStart={() => handleDragStart(player, team, listType)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index, listType, team)}
                    onDragEnd={handleDragEnd}
                    className={`cursor-move hover:bg-gray-50 ${isSelected ? 'bg-blue-100' : ''}`}
                  >
                    <td className="px-3 py-2">
                      <button
                        onClick={() => handleArrowClick(player, team, listType)}
                        className={`p-1 rounded hover:bg-gray-200 ${isSelected ? 'bg-blue-200' : ''}`}
                        title="Click to select for position swap"
                      >
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                        </svg>
                      </button>
                    </td>
                    <td className="px-3 py-2 text-gray-900">{listType === 'starting' ? index + 1 : index + 12}</td>
                    <td className="px-3 py-2 text-gray-900">{player.name}</td>
                    <td className="px-3 py-2 text-gray-900">{player.style}</td>
                    <td className="px-3 py-2 text-gray-900">{player.role}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const getActiveToggleTitle = (team: string, activeToggle: string | null) => {
    if (!activeToggle) return '';
    if (activeToggle === 'tournamentPrepped') return 'Tournament Prepped Teams';
    if (activeToggle === 'lastUsed') return 'Use Last Used Squad';
    if (activeToggle === 'placeholder') return 'Use Placeholder Squad';
    if (activeToggle === 'manualSelect') return 'Manually Select Squad from Database';
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
        <div className="w-full mx-auto px-6 py-4">
          <h1 className="text-3xl font-bold text-gray-900">Match setup</h1>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="bg-white border-b border-gray-200">
        <div className="w-full mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-semibold">
                1
              </div>
              <span className="font-medium text-gray-500">Select match</span>
            </button>
            <div className="flex-1 h-0.5 bg-blue-600"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                2
              </div>
              <span className="font-medium text-blue-600">Squad setup</span>
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

      {/* Squad Setup Section */}
      <div className="w-full mx-auto px-6 py-6">
        <div className="max-w-5xl mx-auto bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h2 className="text-xl font-semibold text-blue-600 mb-6">Squad Setup</h2>

          <div className="grid grid-cols-2 gap-8">
            {/* Home Team */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900">{homeTeam}</h3>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleHomeTeam('tournamentPrepped')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      homeTeamActiveToggle === 'tournamentPrepped' ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        homeTeamActiveToggle === 'tournamentPrepped' ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                  <span className="text-sm text-gray-700">Use Tournament Prepped Squad</span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleHomeTeam('lastUsed')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      homeTeamActiveToggle === 'lastUsed' ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        homeTeamActiveToggle === 'lastUsed' ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                  <span className="text-sm text-gray-700">Use Last Used Squad</span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleHomeTeam('placeholder')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      homeTeamActiveToggle === 'placeholder' ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        homeTeamActiveToggle === 'placeholder' ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                  <span className="text-sm text-gray-700">Use Placeholder Squad</span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleHomeTeam('manualSelect')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      homeTeamActiveToggle === 'manualSelect' ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        homeTeamActiveToggle === 'manualSelect' ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                  <span className="text-sm text-gray-700">Manually Select Squad from Database</span>
                </div>
              </div>

              {/* Player Tables for Home Team */}
              {homeTeamActiveToggle && homeTeamPlayers.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-4">{getActiveToggleTitle(homeTeam, homeTeamActiveToggle)}</h4>
                  {renderPlayerTable(homeTeamPlayers, homeTeam, 'starting')}
                  <div className="bg-gray-200 text-center py-2 text-xs text-gray-600 mb-4">
                    Drag players below to put them in starting XI
                  </div>
                  {renderPlayerTable(homeTeamPlayers, homeTeam, 'reserves')}
                </div>
              )}
            </div>

            {/* Away Team */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900">{awayTeam}</h3>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleAwayTeam('tournamentPrepped')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      awayTeamActiveToggle === 'tournamentPrepped' ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        awayTeamActiveToggle === 'tournamentPrepped' ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                  <span className="text-sm text-gray-700">Use Tournament Prepped Squad</span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleAwayTeam('lastUsed')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      awayTeamActiveToggle === 'lastUsed' ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        awayTeamActiveToggle === 'lastUsed' ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                  <span className="text-sm text-gray-700">Use Last Used Squad</span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleAwayTeam('placeholder')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      awayTeamActiveToggle === 'placeholder' ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        awayTeamActiveToggle === 'placeholder' ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                  <span className="text-sm text-gray-700">Use Placeholder Squad</span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleAwayTeam('manualSelect')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      awayTeamActiveToggle === 'manualSelect' ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        awayTeamActiveToggle === 'manualSelect' ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                  <span className="text-sm text-gray-700">Manually Select Squad from Database</span>
                </div>
              </div>

              {/* Player Tables for Away Team */}
              {awayTeamActiveToggle && awayTeamPlayers.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-4">{getActiveToggleTitle(awayTeam, awayTeamActiveToggle)}</h4>
                  {renderPlayerTable(awayTeamPlayers, awayTeam, 'starting')}
                  <div className="bg-gray-200 text-center py-2 text-xs text-gray-600 mb-4">
                    Drag players below to put them in starting XI
                  </div>
                  {renderPlayerTable(awayTeamPlayers, awayTeam, 'reserves')}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="w-full mx-auto px-6 py-6">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
          <div className="flex items-center justify-center gap-4">
            <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
              &lt;
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
              &gt;
            </button>
            <button
              onClick={() => {
                // Validate that both teams have exactly 11 players in Starting XI
                const homeStartingXI = getStartingXI(homeTeamPlayers);
                const awayStartingXI = getStartingXI(awayTeamPlayers);
                
                const homeValid = homeStartingXI.length === 11;
                const awayValid = awayStartingXI.length === 11;
                
                if (!homeValid || !awayValid) {
                  alert(`Warning: Both teams must have exactly 11 players in Starting XI.\n\n${homeTeam}: ${homeStartingXI.length} players\n${awayTeam}: ${awayStartingXI.length} players`);
                  return;
                }
                
                const params = new URLSearchParams();
                params.set('matchId', matchId);
                params.set('homeTeam', homeTeam);
                params.set('awayTeam', awayTeam);
                params.set('matchInfo', matchInfo);
                params.set('homeTeamSquad', homeTeamActiveToggle || '');
                params.set('awayTeamSquad', awayTeamActiveToggle || '');
                
                // Encode player data as JSON
                const homeStarting = getStartingXI(homeTeamPlayers);
                const homeReserves = getReserves(homeTeamPlayers);
                const awayStarting = getStartingXI(awayTeamPlayers);
                const awayReserves = getReserves(awayTeamPlayers);
                
                params.set('homeTeamStarting', JSON.stringify(homeStarting));
                params.set('homeTeamReserves', JSON.stringify(homeReserves));
                params.set('awayTeamStarting', JSON.stringify(awayStarting));
                params.set('awayTeamReserves', JSON.stringify(awayReserves));
                
                router.push(`/confirm-match-details?${params.toString()}`);
              }}
              className="px-8 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Confirm Squad Setup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SquadSetup() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
      <SquadSetupContent />
    </Suspense>
  );
}

'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

interface PlayerStats {
  id: string;
  position: number;
  playerId: string;
  name: string;
  btCaz: number;
  raw: number;
  sr: number;
  fours: number;
  sixes: number;
  rating: number;
}

interface BowlerStats {
  id: string;
  position: number;
  playerId: string;
  name: string;
  action: string;
  wkts: number;
  overs: number;
  econ: number;
  sr: number;
  rating: number;
}

function MatchDetailsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const matchId = searchParams.get('matchId') || '42049073';
  const homeTeam = searchParams.get('homeTeam') || 'England';
  const awayTeam = searchParams.get('awayTeam') || 'India';
  const matchInfo = searchParams.get('matchInfo') || 'England v India';
  const homeTeamSquad = searchParams.get('homeTeamSquad') || 'lastUsed';
  const awayTeamSquad = searchParams.get('awayTeamSquad') || 'tournamentPrepped';
  const matchDate = searchParams.get('matchDate') || '2025-10-28';
  const matchSeries = searchParams.get('matchSeries') || 'T20 World Cup 2022';
  const matchGround = searchParams.get('matchGround') || "Lord's Cricket Ground";

  const [activeTab, setActiveTab] = useState<'prematch' | 'live'>('prematch');
  
  // State for INNINGS section
  const [inningsData, setInningsData] = useState({
    batting: { england: 249.9, englandValue: 1.02, india: 249.9, indiaValue: 1.02 },
    bowling: { england: 249.9, englandValue: 1.02, india: 249.9, indiaValue: 1.02 },
    totalFactor: { england: 249.9, englandValue: 1.02, india: 249.9, indiaValue: 1.02 },
    conditions: { england: 249.9, value: 0.99 },
  });
  
  // State for MATCH MARKET section
  const [matchMarket, setMatchMarket] = useState({
    adjust: 0.97,
    england: { green: 0.59, red: 1.69, bet365: 249.9, indibet: 249.9, exchange: 249.9 },
    india: { green: 0.33, red: 3.05, bet365: 249.9, indibet: 249.9, exchange: 249.9 },
  });

  // Parse player data from URL params
  const parsePlayerData = () => {
    try {
      const homeTeamStartingJson = searchParams.get('homeTeamStarting');
      const homeTeamReservesJson = searchParams.get('homeTeamReserves');
      const awayTeamStartingJson = searchParams.get('awayTeamStarting');
      const awayTeamReservesJson = searchParams.get('awayTeamReserves');

      // Check if we have valid data
      const hasValidData = homeTeamStartingJson && awayTeamStartingJson;
      
      if (!hasValidData) {
        // Return blank players if no valid data
        return {
          homeStarting: Array(11).fill(null).map((_, i) => ({
            id: String(i + 1),
            position: i + 1,
            playerId: generatePlayerId(),
            name: '',
            btCaz: 0,
            raw: 0,
            sr: 0,
            fours: 0,
            sixes: 0,
            rating: 0,
          })),
          homeSubs: [],
          awayStarting: Array(11).fill(null).map((_, i) => ({
            id: String(i + 1),
            position: i + 1,
            playerId: generatePlayerId(),
            name: '',
            btCaz: 0,
            raw: 0,
            sr: 0,
            fours: 0,
            sixes: 0,
            rating: 0,
          })),
          awaySubs: [],
        };
      }

      const homeStarting = JSON.parse(homeTeamStartingJson);
      const homeReserves = homeTeamReservesJson ? JSON.parse(homeTeamReservesJson) : [];
      const awayStarting = JSON.parse(awayTeamStartingJson);
      const awayReserves = awayTeamReservesJson ? JSON.parse(awayTeamReservesJson) : [];

      // Validate that we have exactly 11 players in starting XI
      const homeValid = Array.isArray(homeStarting) && homeStarting.length === 11;
      const awayValid = Array.isArray(awayStarting) && awayStarting.length === 11;

      if (!homeValid || !awayValid) {
        // Return blank players if validation fails
        return {
          homeStarting: Array(11).fill(null).map((_, i) => ({
            id: String(i + 1),
            position: i + 1,
            playerId: generatePlayerId(),
            name: '',
            btCaz: 0,
            raw: 0,
            sr: 0,
            fours: 0,
            sixes: 0,
            rating: 0,
          })),
          homeSubs: [],
          awayStarting: Array(11).fill(null).map((_, i) => ({
            id: String(i + 1),
            position: i + 1,
            playerId: generatePlayerId(),
            name: '',
            btCaz: 0,
            raw: 0,
            sr: 0,
            fours: 0,
            sixes: 0,
            rating: 0,
          })),
          awaySubs: [],
        };
      }

      // Convert squad setup players to match details format
      const convertToPlayerStats = (players: any[], startPosition: number): PlayerStats[] => {
        return players.map((p, i) => ({
          id: p.id || String(i + startPosition),
          position: startPosition + i,
          playerId: p.id || String(i + startPosition),
          name: p.name || '', // Use actual name from squad setup
          btCaz: 36,
          raw: 37,
          sr: 0.48,
          fours: 0.48,
          sixes: 0.1,
          rating: 0,
        }));
      };

      return {
        homeStarting: convertToPlayerStats(homeStarting, 1),
        homeSubs: convertToPlayerStats(homeReserves, 12),
        awayStarting: convertToPlayerStats(awayStarting, 1),
        awaySubs: convertToPlayerStats(awayReserves, 12),
      };
    } catch (error) {
      // Return blank players on error
      return {
        homeStarting: Array(11).fill(null).map((_, i) => ({
          id: String(i + 1),
          position: i + 1,
          playerId: '',
          name: '',
          btCaz: 0,
          raw: 0,
          sr: 0,
          fours: 0,
          sixes: 0,
          rating: 0,
        })),
        homeSubs: [],
        awayStarting: Array(11).fill(null).map((_, i) => ({
          id: String(i + 1),
          position: i + 1,
          playerId: '',
          name: '',
          btCaz: 0,
          raw: 0,
          sr: 0,
          fours: 0,
          sixes: 0,
          rating: 0,
        })),
        awaySubs: [],
      };
    }
  };

  const parsedData = parsePlayerData();
  
  // Map players based on team names - use homeTeam and awayTeam to determine which data to use
  // For display purposes, we'll use England/India as the display names but use the actual data
  const getTeamStartingXI = (teamName: string) => {
    if (teamName === homeTeam) return parsedData.homeStarting;
    if (teamName === awayTeam) return parsedData.awayStarting;
    return parsedData.homeStarting; // fallback
  };
  
  const getTeamSubs = (teamName: string) => {
    if (teamName === homeTeam) return parsedData.homeSubs;
    if (teamName === awayTeam) return parsedData.awaySubs;
    return parsedData.homeSubs; // fallback
  };
  
  // Use generic state variables based on homeTeam and awayTeam
  const [homeTeamStartingXI, setHomeTeamStartingXI] = useState<PlayerStats[]>(parsedData.homeStarting);
  const [homeTeamSubs, setHomeTeamSubs] = useState<PlayerStats[]>(parsedData.homeSubs);
  const [awayTeamStartingXI, setAwayTeamStartingXI] = useState<PlayerStats[]>(parsedData.awayStarting);
  const [awayTeamSubs, setAwayTeamSubs] = useState<PlayerStats[]>(parsedData.awaySubs);

  const [draggedPlayer, setDraggedPlayer] = useState<{ player: PlayerStats; team: string; list: 'starting' | 'subs' } | null>(null);
  const [selectedPlayerForSwap, setSelectedPlayerForSwap] = useState<{ player: PlayerStats; team: string; list: 'starting' | 'subs' } | null>(null);
  
  // Checkbox states for batters
  const [batterChecked, setBatterChecked] = useState<Record<string, boolean>>({});
  
  // Bowler data - reverse order of batting lineup
  const getBowlerStats = (battingPlayers: PlayerStats[], battingSubs: PlayerStats[]): { starting: BowlerStats[]; subs: BowlerStats[] } => {
    // Predefined bowler stats based on screenshot (England pattern)
    const bowlerDataPattern = [
      { wkts: 1.9, overs: 18.0, econ: 3.10, sr: 0.11, rating: 11, action: 'SEAM' },
      { wkts: 2.1, overs: 19.0, econ: 3.05, sr: 0.12, rating: 16, action: 'SEAM' },
      { wkts: 2.0, overs: 17.5, econ: 3.45, sr: 0.12, rating: 8, action: 'SEAM' },
      { wkts: 1.8, overs: 17.0, econ: 2.95, sr: 0.11, rating: 6, action: 'SEAM' },
      { wkts: 1.5, overs: 19.0, econ: 3.35, sr: 0.08, rating: -5, action: 'OFFS' },
      { wkts: 0.0, overs: 0.0, econ: 3.30, sr: 0.08, rating: 0, action: 'SEAM' },
      { wkts: 0.0, overs: 0.0, econ: 3.30, sr: 0.07, rating: 0, action: 'SEAM' },
      { wkts: 0.0, overs: 0.0, econ: 3.30, sr: 0.07, rating: 0, action: 'SEAM' },
      { wkts: 0.0, overs: 0.0, econ: 3.30, sr: 0.07, rating: 0, action: 'SEAM' },
      { wkts: 0.0, overs: 0.0, econ: 3.30, sr: 0.07, rating: 0, action: 'SEAM' },
      { wkts: 0.0, overs: 0.0, econ: 3.30, sr: 0.07, rating: 0, action: 'SEAM' },
    ];
    
    // Reverse the batting lineup for bowlers
    const starting = [...battingPlayers].reverse().map((p, i) => ({
      id: p.id,
      position: i + 1,
      playerId: p.playerId,
      name: p.name,
      action: bowlerDataPattern[i]?.action || 'SEAM',
      wkts: bowlerDataPattern[i]?.wkts || 0.0,
      overs: bowlerDataPattern[i]?.overs || 0.0,
      econ: bowlerDataPattern[i]?.econ || 3.30,
      sr: bowlerDataPattern[i]?.sr || 0.07,
      rating: bowlerDataPattern[i]?.rating || 0,
    }));
    
    const subs = [...battingSubs].reverse().map((p, i) => ({
      id: p.id,
      position: i + 12,
      playerId: p.playerId,
      name: p.name,
      action: 'SEAM',
      wkts: 2.5,
      overs: 21.5,
      econ: 2.80,
      sr: 0.14,
      rating: 40,
    }));
    
    return { starting, subs };
  };

  const [homeTeamBowlerStarting, setHomeTeamBowlerStarting] = useState<BowlerStats[]>(() => 
    getBowlerStats(homeTeamStartingXI, homeTeamSubs).starting
  );
  const [homeTeamBowlerSubs, setHomeTeamBowlerSubs] = useState<BowlerStats[]>(() => 
    getBowlerStats(homeTeamStartingXI, homeTeamSubs).subs
  );
  const [awayTeamBowlerStarting, setAwayTeamBowlerStarting] = useState<BowlerStats[]>(() => 
    getBowlerStats(awayTeamStartingXI, awayTeamSubs).starting
  );
  const [awayTeamBowlerSubs, setAwayTeamBowlerSubs] = useState<BowlerStats[]>(() => 
    getBowlerStats(awayTeamStartingXI, awayTeamSubs).subs
  );
  
  // Update bowler stats when batting lineup changes
  useEffect(() => {
    const homeBowlers = getBowlerStats(homeTeamStartingXI, homeTeamSubs);
    setHomeTeamBowlerStarting(homeBowlers.starting);
    setHomeTeamBowlerSubs(homeBowlers.subs);
    
    const awayBowlers = getBowlerStats(awayTeamStartingXI, awayTeamSubs);
    setAwayTeamBowlerStarting(awayBowlers.starting);
    setAwayTeamBowlerSubs(awayBowlers.subs);
  }, [homeTeamStartingXI, homeTeamSubs, awayTeamStartingXI, awayTeamSubs]);
  
  // Checkbox states for bowlers
  const [bowlerChecked, setBowlerChecked] = useState<Record<string, boolean>>({});
  
  // Selected player for bowler swap
  const [selectedBowlerForSwap, setSelectedBowlerForSwap] = useState<{ player: BowlerStats; team: string; list: 'starting' | 'subs' } | null>(null);

  const updatePlayerStat = (team: string, list: 'starting' | 'subs', playerId: string, field: keyof PlayerStats, value: number | string) => {
    const isHomeTeam = team === homeTeam;
    if (isHomeTeam) {
      const setter = list === 'starting' ? setHomeTeamStartingXI : setHomeTeamSubs;
      const current = list === 'starting' ? homeTeamStartingXI : homeTeamSubs;
      setter(current.map(p => p.id === playerId ? { ...p, [field]: value } : p));
    } else {
      const setter = list === 'starting' ? setAwayTeamStartingXI : setAwayTeamSubs;
      const current = list === 'starting' ? awayTeamStartingXI : awayTeamSubs;
      setter(current.map(p => p.id === playerId ? { ...p, [field]: value } : p));
    }
  };

  // Generate a random 6 digit player ID
  const generatePlayerId = (): string => {
    // Generate a random number between 100000 and 999999 (6 digits)
    const min = 100000;
    const max = 999999;
    return String(Math.floor(Math.random() * (max - min + 1)) + min);
  };

  const addNewPlayerToSubs = (team: string) => {
    const isHomeTeam = team === homeTeam;
    const currentSubs = isHomeTeam ? homeTeamSubs : awayTeamSubs;
    const setter = isHomeTeam ? setHomeTeamSubs : setAwayTeamSubs;
    
    // Generate a new unique ID
    const maxId = Math.max(
      ...currentSubs.map(p => parseInt(p.id) || 0),
      ...(isHomeTeam ? homeTeamStartingXI : awayTeamStartingXI).map(p => parseInt(p.id) || 0),
      0
    );
    const newId = String(maxId + 1);
    
    const newPlayer: PlayerStats = {
      id: newId,
      position: currentSubs.length > 0 ? Math.max(...currentSubs.map(p => p.position)) + 1 : 12,
      playerId: generatePlayerId(),
      name: '',
      btCaz: 0,
      raw: 0,
      sr: 0,
      fours: 0,
      sixes: 0,
      rating: 0,
    };
    
    setter([...currentSubs, newPlayer]);
  };

  const handleDragStart = (player: PlayerStats, team: string, list: 'starting' | 'subs') => {
    setDraggedPlayer({ player, team, list });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number, targetList: 'starting' | 'subs', team: string) => {
    e.preventDefault();
    if (!draggedPlayer || draggedPlayer.team !== team) return;

    // Use homeTeam/awayTeam to determine which state to update
    const isHomeTeam = team === homeTeam;
    
    if (isHomeTeam) {
      const sourceList = draggedPlayer.list === 'starting' ? [...homeTeamStartingXI] : [...homeTeamSubs];
      const targetListArray = targetList === 'starting' ? [...homeTeamStartingXI] : [...homeTeamSubs];
      const sourceIndex = sourceList.findIndex(p => p.id === draggedPlayer.player.id);
      if (sourceIndex === -1) return;

      // If moving within the same list, just reorder
      if (draggedPlayer.list === targetList) {
        const [removed] = sourceList.splice(sourceIndex, 1);
        // Adjust target index if source was before target
        const adjustedTargetIndex = sourceIndex < targetIndex ? targetIndex - 1 : targetIndex;
        sourceList.splice(adjustedTargetIndex, 0, removed);
        
        // Update positions and set state
        sourceList.forEach((p, i) => {
          p.position = targetList === 'starting' ? i + 1 : i + 12;
        });
        
        if (targetList === 'starting') {
          setHomeTeamStartingXI(sourceList.slice(0, 11));
          setHomeTeamSubs(homeTeamSubs);
        } else {
          setHomeTeamSubs(sourceList.slice(0, 4));
          setHomeTeamStartingXI(homeTeamStartingXI);
        }
      } else {
        // Moving between different lists
        const [removed] = sourceList.splice(sourceIndex, 1);
        targetListArray.splice(targetIndex, 0, removed);

        // Update positions
        sourceList.forEach((p, i) => {
          p.position = draggedPlayer.list === 'starting' ? i + 1 : i + 12;
        });
        targetListArray.forEach((p, i) => {
          p.position = targetList === 'starting' ? i + 1 : i + 12;
        });

        if (targetList === 'starting') {
          setHomeTeamStartingXI(targetListArray.slice(0, 11));
          setHomeTeamSubs(sourceList.slice(0, 4));
        } else {
          setHomeTeamSubs(targetListArray.slice(0, 4));
          setHomeTeamStartingXI(sourceList.slice(0, 11));
        }
      }
    } else {
      const sourceList = draggedPlayer.list === 'starting' ? [...awayTeamStartingXI] : [...awayTeamSubs];
      const targetListArray = targetList === 'starting' ? [...awayTeamStartingXI] : [...awayTeamSubs];
      const sourceIndex = sourceList.findIndex(p => p.id === draggedPlayer.player.id);
      if (sourceIndex === -1) return;

      // If moving within the same list, just reorder
      if (draggedPlayer.list === targetList) {
        const [removed] = sourceList.splice(sourceIndex, 1);
        // Adjust target index if source was before target
        const adjustedTargetIndex = sourceIndex < targetIndex ? targetIndex - 1 : targetIndex;
        sourceList.splice(adjustedTargetIndex, 0, removed);
        
        // Update positions and set state
        sourceList.forEach((p, i) => {
          p.position = targetList === 'starting' ? i + 1 : i + 12;
        });
        
        if (targetList === 'starting') {
          setAwayTeamStartingXI(sourceList.slice(0, 11));
          setAwayTeamSubs(awayTeamSubs);
        } else {
          setAwayTeamSubs(sourceList.slice(0, 4));
          setAwayTeamStartingXI(awayTeamStartingXI);
        }
      } else {
        // Moving between different lists
        const [removed] = sourceList.splice(sourceIndex, 1);
        targetListArray.splice(targetIndex, 0, removed);

        // Update positions
        sourceList.forEach((p, i) => {
          p.position = draggedPlayer.list === 'starting' ? i + 1 : i + 12;
        });
        targetListArray.forEach((p, i) => {
          p.position = targetList === 'starting' ? i + 1 : i + 12;
        });

        if (targetList === 'starting') {
          setAwayTeamStartingXI(targetListArray.slice(0, 11));
          setAwayTeamSubs(sourceList.slice(0, 4));
        } else {
          setAwayTeamSubs(targetListArray.slice(0, 4));
          setAwayTeamStartingXI(sourceList.slice(0, 11));
        }
      }
    }

    setDraggedPlayer(null);
  };

  const handleDragEnd = () => {
    setDraggedPlayer(null);
  };

  const handleArrowClick = (player: PlayerStats, team: string, list: 'starting' | 'subs') => {
    if (!selectedPlayerForSwap) {
      // First player selected for swap
      setSelectedPlayerForSwap({ player, team, list });
    } else {
      // Second player selected - perform swap
      if (selectedPlayerForSwap.team === team) {
        const isHomeTeam = team === homeTeam;
        
        if (selectedPlayerForSwap.list === list) {
          // Swap within same list
          const players = list === 'starting' 
            ? (isHomeTeam ? [...homeTeamStartingXI] : [...awayTeamStartingXI])
            : (isHomeTeam ? [...homeTeamSubs] : [...awayTeamSubs]);
          
          const firstIndex = players.findIndex(p => p.id === selectedPlayerForSwap.player.id);
          const secondIndex = players.findIndex(p => p.id === player.id);
          
          if (firstIndex !== -1 && secondIndex !== -1) {
            // Swap positions
            [players[firstIndex], players[secondIndex]] = [players[secondIndex], players[firstIndex]];
            
            // Update positions
            players.forEach((p, i) => {
              p.position = list === 'starting' ? i + 1 : i + 12;
            });
            
            if (isHomeTeam) {
              if (list === 'starting') {
                setHomeTeamStartingXI(players);
              } else {
                setHomeTeamSubs(players);
              }
            } else {
              if (list === 'starting') {
                setAwayTeamStartingXI(players);
              } else {
                setAwayTeamSubs(players);
              }
            }
          }
        } else {
          // Swap between different lists (starting <-> subs)
          const firstList = selectedPlayerForSwap.list === 'starting'
            ? (isHomeTeam ? [...homeTeamStartingXI] : [...awayTeamStartingXI])
            : (isHomeTeam ? [...homeTeamSubs] : [...awayTeamSubs]);
          const secondList = list === 'starting'
            ? (isHomeTeam ? [...homeTeamStartingXI] : [...awayTeamStartingXI])
            : (isHomeTeam ? [...homeTeamSubs] : [...awayTeamSubs]);
          
          const firstIndex = firstList.findIndex(p => p.id === selectedPlayerForSwap.player.id);
          const secondIndex = secondList.findIndex(p => p.id === player.id);
          
          if (firstIndex !== -1 && secondIndex !== -1) {
            // Swap players between lists
            const [removedFromFirst] = firstList.splice(firstIndex, 1);
            const [removedFromSecond] = secondList.splice(secondIndex, 1);
            
            firstList.splice(firstIndex, 0, removedFromSecond);
            secondList.splice(secondIndex, 0, removedFromFirst);
            
            // Update positions
            firstList.forEach((p, i) => {
              p.position = selectedPlayerForSwap.list === 'starting' ? i + 1 : i + 12;
            });
            secondList.forEach((p, i) => {
              p.position = list === 'starting' ? i + 1 : i + 12;
            });
            
            if (isHomeTeam) {
              if (selectedPlayerForSwap.list === 'starting') {
                setHomeTeamStartingXI(firstList);
                setHomeTeamSubs(secondList);
              } else {
                setHomeTeamSubs(firstList);
                setHomeTeamStartingXI(secondList);
              }
            } else {
              if (selectedPlayerForSwap.list === 'starting') {
                setAwayTeamStartingXI(firstList);
                setAwayTeamSubs(secondList);
              } else {
                setAwayTeamSubs(firstList);
                setAwayTeamStartingXI(secondList);
              }
            }
          }
        }
      }
      setSelectedPlayerForSwap(null);
    }
  };

  const calculateTotals = (players: PlayerStats[]) => {
    return {
      btCaz: players.reduce((sum, p) => sum + p.btCaz, 0),
      raw: players.reduce((sum, p) => sum + p.raw, 0),
      sr: players.reduce((sum, p) => sum + p.sr, 0),
      fours: players.reduce((sum, p) => sum + p.fours, 0),
      sixes: players.reduce((sum, p) => sum + p.sixes, 0),
      rating: players.reduce((sum, p) => sum + p.rating, 0),
    };
  };

  const renderPlayerTable = (
    players: PlayerStats[],
    subs: PlayerStats[],
    team: string,
    teamName: string
  ) => {
    const startingTotals = calculateTotals(players);
    const allTotals = calculateTotals([...players, ...subs]);

    return (
      <div className="flex-1">
        <div className="flex items-center justify-center gap-2 mb-4">
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900">{teamName}</h3>
        </div>

        <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
          <table className="w-full text-sm">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-2 py-2 text-left text-xs font-medium text-white">Pos.</th>
                <th className="px-2 py-2 text-left text-xs font-medium text-white"></th>
                <th className="px-2 py-2 text-left text-xs font-medium text-white w-24">Player ID</th>
                <th className="px-2 py-2 text-left text-xs font-medium text-white w-48">Name</th>
                <th className="px-2 py-2 text-left text-xs font-medium text-white">BT.CAZ</th>
                <th className="px-2 py-2 text-left text-xs font-medium text-white">Raw</th>
                <th className="px-2 py-2 text-left text-xs font-medium text-white">SR</th>
                <th className="px-2 py-2 text-left text-xs font-medium text-white">4s</th>
                <th className="px-2 py-2 text-left text-xs font-medium text-white">6s</th>
                <th className="px-2 py-2 text-left text-xs font-medium text-white">Rating</th>
                <th className="px-2 py-2 text-left text-xs font-medium text-white">Info</th>
                <th className="px-2 py-2 text-center text-xs font-medium text-white w-12">✓</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {players.map((player, index) => {
                const isSelected = selectedPlayerForSwap?.player.id === player.id && selectedPlayerForSwap?.team === team && selectedPlayerForSwap?.list === 'starting';
                return (
                  <tr
                    key={player.id}
                    draggable
                    onDragStart={() => handleDragStart(player, team, 'starting')}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index, 'starting', team)}
                    onDragEnd={handleDragEnd}
                    className={`cursor-move hover:bg-gray-50 ${isSelected ? 'bg-blue-100' : ''} ${batterChecked[`${team}-starting-${player.id}`] ? 'opacity-50 bg-gray-100' : ''}`}
                  >
                    <td className="px-2 py-2 text-gray-900">{player.position}</td>
                    <td className="px-2 py-2">
                      <button
                        onClick={() => handleArrowClick(player, team, 'starting')}
                        className={`p-1.5 rounded-md hover:bg-gray-200 transition-colors shadow-sm ${isSelected ? 'bg-blue-200 ring-2 ring-blue-400' : ''}`}
                        title="Click to select for position swap"
                      >
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                        </svg>
                      </button>
                    </td>
                    <td className="px-2 py-2 w-24 text-center">
                      <span className="text-xs font-mono text-gray-600">{player.playerId || generatePlayerId()}</span>
                    </td>
                    <td className="px-2 py-2 text-gray-900 font-medium w-48">{player.name}</td>
                  <td className="px-2 py-2">
                    <input
                      type="number"
                      value={player.btCaz}
                      onChange={(e) => updatePlayerStat(team, 'starting', player.id, 'btCaz', parseFloat(e.target.value) || 0)}
                      className="w-16 px-1 py-1 border border-gray-300 rounded text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-shadow"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <input
                      type="number"
                      value={player.raw}
                      onChange={(e) => updatePlayerStat(team, 'starting', player.id, 'raw', parseFloat(e.target.value) || 0)}
                      className="w-16 px-1 py-1 border border-gray-300 rounded text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-shadow"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <input
                      type="number"
                      step="0.01"
                      value={player.sr}
                      onChange={(e) => updatePlayerStat(team, 'starting', player.id, 'sr', parseFloat(e.target.value) || 0)}
                      className="w-16 px-1 py-1 border border-gray-300 rounded text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-shadow"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <input
                      type="number"
                      step="0.01"
                      value={player.fours}
                      onChange={(e) => updatePlayerStat(team, 'starting', player.id, 'fours', parseFloat(e.target.value) || 0)}
                      className="w-16 px-1 py-1 border border-gray-300 rounded text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-shadow"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <input
                      type="number"
                      step="0.01"
                      value={player.sixes}
                      onChange={(e) => updatePlayerStat(team, 'starting', player.id, 'sixes', parseFloat(e.target.value) || 0)}
                      className="w-16 px-1 py-1 border border-gray-300 rounded text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-shadow"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      player.rating >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {player.rating > 0 ? '+' : ''}{player.rating}
                    </span>
                  </td>
                  <td className="px-2 py-2">
                    <svg className="w-4 h-4 text-gray-400 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </td>
                  <td className="px-2 py-2 text-center w-12">
                    <button
                      onClick={() => {
                        const key = `${team}-starting-${player.id}`;
                        setBatterChecked(prev => ({ ...prev, [key]: !prev[key] }));
                      }}
                      className={`w-8 h-8 flex items-center justify-center rounded-md border-2 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        batterChecked[`${team}-starting-${player.id}`]
                          ? 'bg-blue-600 border-blue-600 text-white hover:bg-blue-700'
                          : 'bg-white border-gray-300 text-gray-400 hover:border-blue-400 hover:text-blue-500'
                      }`}
                    >
                      {batterChecked[`${team}-starting-${player.id}`] ? (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  </td>
                </tr>
                );
              })}
              <tr className="bg-gray-100 font-semibold">
                <td colSpan={4} className="px-2 py-2 text-gray-900">TOTALS</td>
                <td className="px-2 py-2 text-gray-900">{startingTotals.btCaz}</td>
                <td className="px-2 py-2 text-gray-900">{startingTotals.raw}</td>
                <td className="px-2 py-2 text-gray-900">{startingTotals.sr.toFixed(2)}</td>
                <td className="px-2 py-2 text-gray-900">{startingTotals.fours.toFixed(2)}</td>
                <td className="px-2 py-2 text-gray-900">{startingTotals.sixes.toFixed(2)}</td>
                <td className="px-2 py-2 text-gray-900">{startingTotals.rating.toFixed(2)}</td>
                <td colSpan={2} className="px-2 py-3">
                  <button
                    onClick={() => {
                      const newChecked: Record<string, boolean> = {};
                      players.forEach(p => {
                        newChecked[`${team}-starting-${p.id}`] = true;
                      });
                      setBatterChecked(prev => ({ ...prev, ...newChecked }));
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-all shadow-md hover:shadow-lg whitespace-nowrap"
                  >
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Accept all
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mb-3 mt-6">
          <h4 className="text-sm font-semibold text-gray-700">SUBS</h4>
        </div>
        <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm bg-white">
          <table className="w-full text-sm">
            <thead className="bg-gray-700 border-b border-gray-600">
              <tr>
                <th className="px-2 py-2 text-left text-xs font-semibold text-white">Pos.</th>
                <th className="px-2 py-2 text-left text-xs font-semibold text-white"></th>
                <th className="px-2 py-2 text-left text-xs font-semibold text-white">Player ID</th>
                <th className="px-2 py-2 text-left text-xs font-semibold text-white w-48">Name</th>
                <th className="px-2 py-2 text-left text-xs font-semibold text-white">BT.CAZ</th>
                <th className="px-2 py-2 text-left text-xs font-semibold text-white">Raw</th>
                <th className="px-2 py-2 text-left text-xs font-semibold text-white">SR</th>
                <th className="px-2 py-2 text-left text-xs font-semibold text-white">4s</th>
                <th className="px-2 py-2 text-left text-xs font-semibold text-white">6s</th>
                <th className="px-2 py-2 text-left text-xs font-semibold text-white">Rating</th>
                <th className="px-2 py-2 text-left text-xs font-semibold text-white">Info</th>
                <th className="px-2 py-2 text-center text-xs font-semibold text-white w-12">✓</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {subs.map((player, index) => {
                const isSelected = selectedPlayerForSwap?.player.id === player.id && selectedPlayerForSwap?.team === team && selectedPlayerForSwap?.list === 'subs';
                return (
                  <tr
                    key={player.id}
                    draggable
                    onDragStart={() => handleDragStart(player, team, 'subs')}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index, 'subs', team)}
                    onDragEnd={handleDragEnd}
                    className={`cursor-move hover:bg-gray-50 ${isSelected ? 'bg-blue-100' : ''} ${batterChecked[`${team}-subs-${player.id}`] ? 'opacity-50 bg-gray-100' : ''}`}
                  >
                    <td className="px-2 py-2 text-gray-900">{player.position}</td>
                    <td className="px-2 py-2">
                      <button
                        onClick={() => handleArrowClick(player, team, 'subs')}
                        className={`p-1.5 rounded-md hover:bg-gray-200 transition-colors shadow-sm ${isSelected ? 'bg-blue-200 ring-2 ring-blue-400' : ''}`}
                        title="Click to select for position swap"
                      >
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                        </svg>
                      </button>
                    </td>
                    <td className="px-2 py-2 w-24 text-center">
                      <span className="text-xs font-mono text-gray-600">{player.playerId || generatePlayerId()}</span>
                    </td>
                    <td className="px-2 py-2 text-gray-900 font-medium w-48">{player.name}</td>
                  <td className="px-2 py-2">
                    <input
                      type="number"
                      value={player.btCaz}
                      onChange={(e) => updatePlayerStat(team, 'subs', player.id, 'btCaz', parseFloat(e.target.value) || 0)}
                      className="w-16 px-1 py-1 border border-gray-300 rounded text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-shadow"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <input
                      type="number"
                      value={player.raw}
                      onChange={(e) => updatePlayerStat(team, 'subs', player.id, 'raw', parseFloat(e.target.value) || 0)}
                      className="w-16 px-1 py-1 border border-gray-300 rounded text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-shadow"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <input
                      type="number"
                      step="0.01"
                      value={player.sr}
                      onChange={(e) => updatePlayerStat(team, 'subs', player.id, 'sr', parseFloat(e.target.value) || 0)}
                      className="w-16 px-1 py-1 border border-gray-300 rounded text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-shadow"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <input
                      type="number"
                      step="0.01"
                      value={player.fours}
                      onChange={(e) => updatePlayerStat(team, 'subs', player.id, 'fours', parseFloat(e.target.value) || 0)}
                      className="w-16 px-1 py-1 border border-gray-300 rounded text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-shadow"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <input
                      type="number"
                      step="0.01"
                      value={player.sixes}
                      onChange={(e) => updatePlayerStat(team, 'subs', player.id, 'sixes', parseFloat(e.target.value) || 0)}
                      className="w-16 px-1 py-1 border border-gray-300 rounded text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-shadow"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      player.rating >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {player.rating > 0 ? '+' : ''}{player.rating}
                    </span>
                  </td>
                  <td className="px-2 py-2">
                    <svg className="w-4 h-4 text-gray-400 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </td>
                  <td className="px-2 py-2 text-center w-12">
                    <button
                      onClick={() => {
                        const key = `${team}-subs-${player.id}`;
                        setBatterChecked(prev => ({ ...prev, [key]: !prev[key] }));
                      }}
                      className={`w-8 h-8 flex items-center justify-center rounded-md border-2 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        batterChecked[`${team}-subs-${player.id}`]
                          ? 'bg-blue-600 border-blue-600 text-white hover:bg-blue-700'
                          : 'bg-white border-gray-300 text-gray-400 hover:border-blue-400 hover:text-blue-500'
                      }`}
                    >
                      {batterChecked[`${team}-subs-${player.id}`] ? (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-4">
          <button
            onClick={() => addNewPlayerToSubs(team)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-all shadow-md hover:shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Add new player
          </button>
        </div>
      </div>
    );
  };

  const handleBowlerArrowClick = (player: BowlerStats, team: string, list: 'starting' | 'subs') => {
    if (!selectedBowlerForSwap) {
      setSelectedBowlerForSwap({ player, team, list });
    } else {
      if (selectedBowlerForSwap.team === team) {
        if (selectedBowlerForSwap.list === list) {
          // Swap within same list
          const bowlers = list === 'starting' 
            ? (team === homeTeam ? [...homeTeamBowlerStarting] : [...awayTeamBowlerStarting])
            : (team === homeTeam ? [...homeTeamBowlerSubs] : [...awayTeamBowlerSubs]);
          
          const firstIndex = bowlers.findIndex(p => p.id === selectedBowlerForSwap.player.id);
          const secondIndex = bowlers.findIndex(p => p.id === player.id);
          
          if (firstIndex !== -1 && secondIndex !== -1) {
            [bowlers[firstIndex], bowlers[secondIndex]] = [bowlers[secondIndex], bowlers[firstIndex]];
            bowlers.forEach((p, i) => {
              p.position = list === 'starting' ? i + 1 : i + 12;
            });
            
            const isHomeTeam = team === homeTeam;
            if (isHomeTeam) {
              if (list === 'starting') {
                setHomeTeamBowlerStarting(bowlers);
              } else {
                setHomeTeamBowlerSubs(bowlers);
              }
            } else {
              if (list === 'starting') {
                setAwayTeamBowlerStarting(bowlers);
              } else {
                setAwayTeamBowlerSubs(bowlers);
              }
            }
          }
        } else {
          // Swap between different lists (starting <-> subs)
          const firstList = selectedBowlerForSwap.list === 'starting'
            ? (team === homeTeam ? [...homeTeamBowlerStarting] : [...awayTeamBowlerStarting])
            : (team === homeTeam ? [...homeTeamBowlerSubs] : [...awayTeamBowlerSubs]);
          const secondList = list === 'starting'
            ? (team === homeTeam ? [...homeTeamBowlerStarting] : [...awayTeamBowlerStarting])
            : (team === homeTeam ? [...homeTeamBowlerSubs] : [...awayTeamBowlerSubs]);
          
          const firstIndex = firstList.findIndex(p => p.id === selectedBowlerForSwap.player.id);
          const secondIndex = secondList.findIndex(p => p.id === player.id);
          
          if (firstIndex !== -1 && secondIndex !== -1) {
            // Swap players between lists
            const [removedFromFirst] = firstList.splice(firstIndex, 1);
            const [removedFromSecond] = secondList.splice(secondIndex, 1);
            
            firstList.splice(firstIndex, 0, removedFromSecond);
            secondList.splice(secondIndex, 0, removedFromFirst);
            
            // Update positions
            firstList.forEach((p, i) => {
              p.position = selectedBowlerForSwap.list === 'starting' ? i + 1 : i + 12;
            });
            secondList.forEach((p, i) => {
              p.position = list === 'starting' ? i + 1 : i + 12;
            });
            
            const isHomeTeam = team === homeTeam;
            if (isHomeTeam) {
              if (selectedBowlerForSwap.list === 'starting') {
                setHomeTeamBowlerStarting(firstList);
                setHomeTeamBowlerSubs(secondList);
              } else {
                setHomeTeamBowlerSubs(firstList);
                setHomeTeamBowlerStarting(secondList);
              }
            } else {
              if (selectedBowlerForSwap.list === 'starting') {
                setAwayTeamBowlerStarting(firstList);
                setAwayTeamBowlerSubs(secondList);
              } else {
                setAwayTeamBowlerSubs(firstList);
                setAwayTeamBowlerStarting(secondList);
              }
            }
          }
        }
      }
      setSelectedBowlerForSwap(null);
    }
  };

  const renderBowlerTable = (
    bowlers: BowlerStats[],
    subs: BowlerStats[],
    team: string,
    teamName: string
  ) => {
    const startingTotals = {
      wkts: bowlers.reduce((sum, p) => sum + p.wkts, 0),
      overs: bowlers.reduce((sum, p) => sum + p.overs, 0),
      econ: bowlers.reduce((sum, p) => sum + p.econ, 0),
      sr: bowlers.reduce((sum, p) => sum + p.sr, 0),
      rating: bowlers.reduce((sum, p) => sum + p.rating, 0),
    };

    return (
      <div className="flex-1">
        <div className="flex items-center justify-center gap-2 mb-4">
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900">{teamName}</h3>
        </div>

        <div className="mb-3">
          <h4 className="text-sm font-semibold text-gray-700">STARTING XI</h4>
        </div>
        <div className="border border-gray-300 rounded-lg overflow-hidden mb-6 shadow-sm bg-white">
          <table className="w-full text-sm">
            <thead className="bg-gray-700 border-b border-gray-600">
              <tr>
                <th className="px-2 py-2 text-left text-xs font-semibold text-white">Pos.</th>
                <th className="px-2 py-2 text-left text-xs font-semibold text-white"></th>
                <th className="px-2 py-2 text-left text-xs font-semibold text-white">Player ID</th>
                <th className="px-2 py-2 text-left text-xs font-semibold text-white w-48">Name</th>
                <th className="px-2 py-2 text-left text-xs font-semibold text-white">Action</th>
                <th className="px-2 py-2 text-left text-xs font-semibold text-white">WKTS</th>
                <th className="px-2 py-2 text-left text-xs font-semibold text-white">Overs</th>
                <th className="px-2 py-2 text-left text-xs font-semibold text-white">Econ</th>
                <th className="px-2 py-2 text-left text-xs font-semibold text-white">SR</th>
                <th className="px-2 py-2 text-left text-xs font-semibold text-white">Rating</th>
                <th className="px-2 py-2 text-left text-xs font-semibold text-white">Info</th>
                <th className="px-2 py-2 text-center text-xs font-semibold text-white w-12">✓</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bowlers.map((bowler, index) => {
                const isSelected = selectedBowlerForSwap?.player.id === bowler.id && selectedBowlerForSwap?.team === team && selectedBowlerForSwap?.list === 'starting';
                return (
                  <tr
                    key={bowler.id}
                    className={`hover:bg-gray-50 ${isSelected ? 'bg-blue-100' : ''} ${bowlerChecked[`${team}-bowler-starting-${bowler.id}`] ? 'opacity-50 bg-gray-100' : ''}`}
                  >
                    <td className="px-2 py-2 text-gray-900">{bowler.position}</td>
                    <td className="px-2 py-2">
                      <button
                        onClick={() => handleBowlerArrowClick(bowler, team, 'starting')}
                        className={`p-1.5 rounded-md hover:bg-gray-200 transition-colors shadow-sm ${isSelected ? 'bg-blue-200 ring-2 ring-blue-400' : ''}`}
                        title="Click to select for position swap"
                      >
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                        </svg>
                      </button>
                    </td>
                    <td className="px-2 py-2 w-24 text-center">
                      <span className="text-xs font-mono text-gray-600">{bowler.playerId || generatePlayerId()}</span>
                    </td>
                    <td className="px-2 py-2 text-gray-900 font-medium w-48">{bowler.name}</td>
                    <td className="px-2 py-2">
                      <select className="w-20 px-1 py-1 border border-gray-300 rounded text-xs">
                        <option>{bowler.action}</option>
                        <option>SEAM</option>
                        <option>OFFS</option>
                      </select>
                    </td>
                    <td className="px-2 py-2">
                      <input
                        type="number"
                        step="0.1"
                        value={bowler.wkts}
                        onChange={(e) => {
                          const newBowlers = [...bowlers];
                          newBowlers[index].wkts = parseFloat(e.target.value) || 0;
                          const isHomeTeam = team === homeTeam;
                          if (isHomeTeam) {
                            setHomeTeamBowlerStarting(newBowlers);
                          } else {
                            setAwayTeamBowlerStarting(newBowlers);
                          }
                        }}
                        className="w-16 px-1 py-1 border border-gray-300 rounded text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-shadow"
                      />
                    </td>
                    <td className="px-2 py-2">
                      <input
                        type="number"
                        step="0.1"
                        value={bowler.overs}
                        onChange={(e) => {
                          const newBowlers = [...bowlers];
                          newBowlers[index].overs = parseFloat(e.target.value) || 0;
                          const isHomeTeam = team === homeTeam;
                          if (isHomeTeam) {
                            setHomeTeamBowlerStarting(newBowlers);
                          } else {
                            setAwayTeamBowlerStarting(newBowlers);
                          }
                        }}
                        className="w-16 px-1 py-1 border border-gray-300 rounded text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-shadow"
                      />
                    </td>
                    <td className="px-2 py-2">
                      <input
                        type="number"
                        step="0.01"
                        value={bowler.econ}
                        onChange={(e) => {
                          const newBowlers = [...bowlers];
                          newBowlers[index].econ = parseFloat(e.target.value) || 0;
                          const isHomeTeam = team === homeTeam;
                          if (isHomeTeam) {
                            setHomeTeamBowlerStarting(newBowlers);
                          } else {
                            setAwayTeamBowlerStarting(newBowlers);
                          }
                        }}
                        className="w-16 px-1 py-1 border border-gray-300 rounded text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-shadow"
                      />
                    </td>
                    <td className="px-2 py-2">
                      <input
                        type="number"
                        step="0.01"
                        value={bowler.sr}
                        onChange={(e) => {
                          const newBowlers = [...bowlers];
                          newBowlers[index].sr = parseFloat(e.target.value) || 0;
                          const isHomeTeam = team === homeTeam;
                          if (isHomeTeam) {
                            setHomeTeamBowlerStarting(newBowlers);
                          } else {
                            setAwayTeamBowlerStarting(newBowlers);
                          }
                        }}
                        className="w-16 px-1 py-1 border border-gray-300 rounded text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-shadow"
                      />
                    </td>
                    <td className="px-2 py-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        bowler.rating >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {bowler.rating > 0 ? '+' : ''}{bowler.rating}
                      </span>
                    </td>
                    <td className="px-2 py-2">
                      <svg className="w-4 h-4 text-gray-400 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </td>
                    <td className="px-2 py-2 text-center w-12">
                      <button
                        onClick={() => {
                          const key = `${team}-bowler-starting-${bowler.id}`;
                          setBowlerChecked(prev => ({ ...prev, [key]: !prev[key] }));
                        }}
                        className={`w-8 h-8 flex items-center justify-center rounded-md border-2 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          bowlerChecked[`${team}-bowler-starting-${bowler.id}`]
                            ? 'bg-blue-600 border-blue-600 text-white hover:bg-blue-700'
                            : 'bg-white border-gray-300 text-gray-400 hover:border-blue-400 hover:text-blue-500'
                        }`}
                      >
                        {bowlerChecked[`${team}-bowler-starting-${bowler.id}`] ? (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
              <tr className="bg-gray-100 font-semibold">
                <td colSpan={5} className="px-2 py-2 text-gray-900">TOTALS</td>
                <td className="px-2 py-2 text-gray-900">{startingTotals.wkts.toFixed(2)}</td>
                <td className="px-2 py-2 text-gray-900">{startingTotals.overs.toFixed(1)}</td>
                <td className="px-2 py-2 text-gray-900">{startingTotals.econ.toFixed(2)}</td>
                <td className="px-2 py-2 text-gray-900">{startingTotals.sr.toFixed(2)}</td>
                <td className="px-2 py-2 text-gray-900">{startingTotals.rating.toFixed(0)}</td>
                <td colSpan={2} className="px-2 py-3">
                  <button
                    onClick={() => {
                      const newChecked: Record<string, boolean> = {};
                      bowlers.forEach(b => {
                        newChecked[`${team}-bowler-starting-${b.id}`] = true;
                      });
                      setBowlerChecked(prev => ({ ...prev, ...newChecked }));
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-all shadow-md hover:shadow-lg whitespace-nowrap"
                  >
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Accept all
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mb-3 mt-6">
          <h4 className="text-sm font-semibold text-gray-700">SUBS</h4>
        </div>
        <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm bg-white">
          <table className="w-full text-sm">
            <thead className="bg-gray-700 border-b border-gray-600">
              <tr>
                <th className="px-2 py-2 text-left text-xs font-semibold text-white">Pos.</th>
                <th className="px-2 py-2 text-left text-xs font-semibold text-white"></th>
                <th className="px-2 py-2 text-left text-xs font-semibold text-white">Player ID</th>
                <th className="px-2 py-2 text-left text-xs font-semibold text-white w-48">Name</th>
                <th className="px-2 py-2 text-left text-xs font-semibold text-white">Action</th>
                <th className="px-2 py-2 text-left text-xs font-semibold text-white">WKTS</th>
                <th className="px-2 py-2 text-left text-xs font-semibold text-white">Overs</th>
                <th className="px-2 py-2 text-left text-xs font-semibold text-white">Econ</th>
                <th className="px-2 py-2 text-left text-xs font-semibold text-white">SR</th>
                <th className="px-2 py-2 text-left text-xs font-semibold text-white">Rating</th>
                <th className="px-2 py-2 text-left text-xs font-semibold text-white">Info</th>
                <th className="px-2 py-2 text-center text-xs font-semibold text-white w-12">✓</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {subs.map((bowler, index) => {
                const isSelected = selectedBowlerForSwap?.player.id === bowler.id && selectedBowlerForSwap?.team === team && selectedBowlerForSwap?.list === 'subs';
                return (
                  <tr
                    key={bowler.id}
                    className={`hover:bg-gray-50 ${isSelected ? 'bg-blue-100' : ''} ${bowlerChecked[`${team}-bowler-subs-${bowler.id}`] ? 'opacity-50 bg-gray-100' : ''}`}
                  >
                    <td className="px-2 py-2 text-gray-900">{bowler.position}</td>
                    <td className="px-2 py-2">
                      <button
                        onClick={() => handleBowlerArrowClick(bowler, team, 'subs')}
                        className={`p-1.5 rounded-md hover:bg-gray-200 transition-colors shadow-sm ${isSelected ? 'bg-blue-200 ring-2 ring-blue-400' : ''}`}
                        title="Click to select for position swap"
                      >
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                        </svg>
                      </button>
                    </td>
                    <td className="px-2 py-2 w-24 text-center">
                      <span className="text-xs font-mono text-gray-600">{bowler.playerId || generatePlayerId()}</span>
                    </td>
                    <td className="px-2 py-2 text-gray-900 font-medium w-48">{bowler.name}</td>
                    <td className="px-2 py-2">
                      <select className="w-20 px-1 py-1 border border-gray-300 rounded text-xs">
                        <option>{bowler.action}</option>
                        <option>SEAM</option>
                        <option>OFFS</option>
                      </select>
                    </td>
                    <td className="px-2 py-2">
                      <input
                        type="number"
                        step="0.1"
                        value={bowler.wkts}
                        onChange={(e) => {
                          const newSubs = [...subs];
                          newSubs[index].wkts = parseFloat(e.target.value) || 0;
                          const isHomeTeam = team === homeTeam;
                          if (isHomeTeam) {
                            setHomeTeamBowlerSubs(newSubs);
                          } else {
                            setAwayTeamBowlerSubs(newSubs);
                          }
                        }}
                        className="w-16 px-1 py-1 border border-gray-300 rounded text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-shadow"
                      />
                    </td>
                    <td className="px-2 py-2">
                      <input
                        type="number"
                        step="0.1"
                        value={bowler.overs}
                        onChange={(e) => {
                          const newSubs = [...subs];
                          newSubs[index].overs = parseFloat(e.target.value) || 0;
                          const isHomeTeam = team === homeTeam;
                          if (isHomeTeam) {
                            setHomeTeamBowlerSubs(newSubs);
                          } else {
                            setAwayTeamBowlerSubs(newSubs);
                          }
                        }}
                        className="w-16 px-1 py-1 border border-gray-300 rounded text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-shadow"
                      />
                    </td>
                    <td className="px-2 py-2">
                      <input
                        type="number"
                        step="0.01"
                        value={bowler.econ}
                        onChange={(e) => {
                          const newSubs = [...subs];
                          newSubs[index].econ = parseFloat(e.target.value) || 0;
                          const isHomeTeam = team === homeTeam;
                          if (isHomeTeam) {
                            setHomeTeamBowlerSubs(newSubs);
                          } else {
                            setAwayTeamBowlerSubs(newSubs);
                          }
                        }}
                        className="w-16 px-1 py-1 border border-gray-300 rounded text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-shadow"
                      />
                    </td>
                    <td className="px-2 py-2">
                      <input
                        type="number"
                        step="0.01"
                        value={bowler.sr}
                        onChange={(e) => {
                          const newSubs = [...subs];
                          newSubs[index].sr = parseFloat(e.target.value) || 0;
                          const isHomeTeam = team === homeTeam;
                          if (isHomeTeam) {
                            setHomeTeamBowlerSubs(newSubs);
                          } else {
                            setAwayTeamBowlerSubs(newSubs);
                          }
                        }}
                        className="w-16 px-1 py-1 border border-gray-300 rounded text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-shadow"
                      />
                    </td>
                    <td className="px-2 py-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        bowler.rating >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {bowler.rating > 0 ? '+' : ''}{bowler.rating}
                      </span>
                    </td>
                    <td className="px-2 py-2">
                      <svg className="w-4 h-4 text-gray-400 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </td>
                    <td className="px-2 py-2 text-center w-12">
                      <button
                        onClick={() => {
                          const key = `${team}-bowler-subs-${bowler.id}`;
                          setBowlerChecked(prev => ({ ...prev, [key]: !prev[key] }));
                        }}
                        className={`w-8 h-8 flex items-center justify-center rounded-md border-2 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          bowlerChecked[`${team}-bowler-subs-${bowler.id}`]
                            ? 'bg-blue-600 border-blue-600 text-white hover:bg-blue-700'
                            : 'bg-white border-gray-300 text-gray-400 hover:border-blue-400 hover:text-blue-500'
                        }`}
                      >
                        {bowlerChecked[`${team}-bowler-subs-${bowler.id}`] ? (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-4">
          <button
            onClick={() => addNewPlayerToSubs(team)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-all shadow-md hover:shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Add new player
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
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
          </nav>
        </div>
      </div>

      {/* Fixed Top Panel */}
      <div className="bg-white border-b border-gray-300 flex-shrink-0 sticky top-0 z-20 shadow-lg">
        <div className="w-full mx-auto px-6 py-4">
          <div className="grid grid-cols-3 gap-4">
            {/* Match Overview */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <h2 className="text-lg font-semibold text-gray-900">{matchInfo}</h2>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <div>{matchSeries}</div>
                <div>{matchGround}</div>
                <div>{matchDate ? new Date(matchDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '28/10/2022'}</div>
                <div className="flex items-center gap-2 mt-2">
                  <span>SR Match ID:</span>
                  <span className="font-mono">sr:match:{matchId}</span>
                  <button className="text-blue-600 hover:text-blue-700">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Innings Section */}
            <div className="flex flex-col items-center">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 text-center">INNINGS</h3>
              <div className="border border-gray-200 rounded-lg overflow-hidden bg-white w-full max-w-lg">
                {/* Team Headers */}
                <div className="grid grid-cols-5 gap-3 bg-gray-50 px-4 py-2 border-b border-gray-200">
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span className="text-xs font-medium text-gray-700">{homeTeam}</span>
                  </div>
                  <div></div>
                  <div className="text-center"></div>
                  <div></div>
                  <div className="flex items-center gap-1 justify-end">
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span className="text-xs font-medium text-gray-700">{awayTeam}</span>
                  </div>
                </div>
                
                {/* Batting */}
                <div className="grid grid-cols-5 gap-3 px-4 py-1.5 border-b border-gray-200 items-center">
                  <div className="flex items-center justify-end">
                    <input
                      type="number"
                      step="0.1"
                      value={inningsData.batting.england}
                      onChange={(e) => setInningsData(prev => ({
                        ...prev,
                        batting: { ...prev.batting, england: parseFloat(e.target.value) || 0 }
                      }))}
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-sm text-center"
                    />
                  </div>
                  <div className="flex items-center justify-start">
                    <input
                      type="number"
                      step="0.01"
                      value={inningsData.batting.englandValue}
                      onChange={(e) => setInningsData(prev => ({
                        ...prev,
                        batting: { ...prev.batting, englandValue: parseFloat(e.target.value) || 0 }
                      }))}
                      className="w-16 px-2 py-1 border border-gray-300 rounded text-xs text-center"
                    />
                  </div>
                  <div className="flex items-center justify-center text-sm text-gray-700 font-medium">Batting</div>
                  <div className="flex items-center justify-end">
                    <input
                      type="number"
                      step="0.01"
                      value={inningsData.batting.indiaValue}
                      onChange={(e) => setInningsData(prev => ({
                        ...prev,
                        batting: { ...prev.batting, indiaValue: parseFloat(e.target.value) || 0 }
                      }))}
                      className="w-16 px-2 py-1 border border-gray-300 rounded text-xs text-center"
                    />
                  </div>
                  <div className="flex items-center justify-start">
                    <input
                      type="number"
                      step="0.1"
                      value={inningsData.batting.india}
                      onChange={(e) => setInningsData(prev => ({
                        ...prev,
                        batting: { ...prev.batting, india: parseFloat(e.target.value) || 0 }
                      }))}
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-sm text-center"
                    />
                  </div>
                </div>
                
                {/* Bowling */}
                <div className="grid grid-cols-5 gap-3 px-4 py-1.5 border-b border-gray-200 items-center">
                  <div className="flex items-center justify-end">
                    <input
                      type="number"
                      step="0.1"
                      value={inningsData.bowling.england}
                      onChange={(e) => setInningsData(prev => ({
                        ...prev,
                        bowling: { ...prev.bowling, england: parseFloat(e.target.value) || 0 }
                      }))}
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-sm text-center"
                    />
                  </div>
                  <div className="flex items-center justify-start">
                    <input
                      type="number"
                      step="0.01"
                      value={inningsData.bowling.englandValue}
                      onChange={(e) => setInningsData(prev => ({
                        ...prev,
                        bowling: { ...prev.bowling, englandValue: parseFloat(e.target.value) || 0 }
                      }))}
                      className="w-16 px-2 py-1 border border-gray-300 rounded text-xs text-center"
                    />
                  </div>
                  <div className="flex items-center justify-center text-sm text-gray-700 font-medium">Bowling</div>
                  <div className="flex items-center justify-end">
                    <input
                      type="number"
                      step="0.01"
                      value={inningsData.bowling.indiaValue}
                      onChange={(e) => setInningsData(prev => ({
                        ...prev,
                        bowling: { ...prev.bowling, indiaValue: parseFloat(e.target.value) || 0 }
                      }))}
                      className="w-16 px-2 py-1 border border-gray-300 rounded text-xs text-center"
                    />
                  </div>
                  <div className="flex items-center justify-start">
                    <input
                      type="number"
                      step="0.1"
                      value={inningsData.bowling.india}
                      onChange={(e) => setInningsData(prev => ({
                        ...prev,
                        bowling: { ...prev.bowling, india: parseFloat(e.target.value) || 0 }
                      }))}
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-sm text-center"
                    />
                  </div>
                </div>
                
                {/* Total Factor */}
                <div className="grid grid-cols-5 gap-3 px-4 py-1.5 border-b border-gray-200 items-center">
                  <div className="flex items-center justify-end">
                    <input
                      type="number"
                      step="0.1"
                      value={inningsData.totalFactor.england}
                      onChange={(e) => setInningsData(prev => ({
                        ...prev,
                        totalFactor: { ...prev.totalFactor, england: parseFloat(e.target.value) || 0 }
                      }))}
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-sm text-center"
                    />
                  </div>
                  <div className="flex items-center justify-start">
                    <input
                      type="number"
                      step="0.01"
                      value={inningsData.totalFactor.englandValue}
                      onChange={(e) => setInningsData(prev => ({
                        ...prev,
                        totalFactor: { ...prev.totalFactor, englandValue: parseFloat(e.target.value) || 0 }
                      }))}
                      className="w-16 px-2 py-1 border border-gray-300 rounded text-xs text-center"
                    />
                  </div>
                  <div className="flex items-center justify-center text-sm text-gray-700 font-medium">Total Factor</div>
                  <div className="flex items-center justify-end">
                    <input
                      type="number"
                      step="0.01"
                      value={inningsData.totalFactor.indiaValue}
                      onChange={(e) => setInningsData(prev => ({
                        ...prev,
                        totalFactor: { ...prev.totalFactor, indiaValue: parseFloat(e.target.value) || 0 }
                      }))}
                      className="w-16 px-2 py-1 border border-gray-300 rounded text-xs text-center"
                    />
                  </div>
                  <div className="flex items-center justify-start">
                    <input
                      type="number"
                      step="0.1"
                      value={inningsData.totalFactor.india}
                      onChange={(e) => setInningsData(prev => ({
                        ...prev,
                        totalFactor: { ...prev.totalFactor, india: parseFloat(e.target.value) || 0 }
                      }))}
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-sm text-center"
                    />
                  </div>
                </div>
                
                {/* Conditions */}
                <div className="grid grid-cols-5 gap-3 px-4 py-1.5 items-center">
                  <div className="flex items-center justify-end">
                    <input
                      type="number"
                      step="0.1"
                      value={inningsData.conditions.england}
                      onChange={(e) => setInningsData(prev => ({
                        ...prev,
                        conditions: { ...prev.conditions, england: parseFloat(e.target.value) || 0 }
                      }))}
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-sm text-center"
                    />
                  </div>
                  <div></div>
                  <div className="flex items-center justify-center text-sm text-gray-700 font-medium">Conditions</div>
                  <div></div>
                  <div className="flex items-center justify-end gap-1">
                    <select
                      value={inningsData.conditions.value}
                      onChange={(e) => setInningsData(prev => ({
                        ...prev,
                        conditions: { ...prev.conditions, value: parseFloat(e.target.value) || 0 }
                      }))}
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                    >
                      <option value="0.99">0.99</option>
                      <option value="0.98">0.98</option>
                      <option value="1.00">1.00</option>
                    </select>
                    <button
                      onClick={() => setInningsData(prev => ({
                        ...prev,
                        conditions: { ...prev.conditions, value: Math.min(prev.conditions.value + 0.01, 1.0) }
                      }))}
                      className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-50"
                      title="Increase"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setInningsData(prev => ({
                        ...prev,
                        conditions: { ...prev.conditions, value: Math.max(prev.conditions.value - 0.01, 0) }
                      }))}
                      className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-50"
                      title="Decrease"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Match Market */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-700">MATCH MARKET</h3>
                <div className="flex items-center gap-2">
                  <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50">
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50">
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-base text-gray-700 font-semibold w-24">{homeTeam}</span>
                      <button
                        onClick={() => {}}
                        className="bg-green-100 text-green-800 px-3 py-1.5 rounded text-sm font-medium text-center hover:bg-green-200 w-16"
                      >
                        {matchMarket.england.green.toFixed(2)}
                      </button>
                      <button
                        onClick={() => {}}
                        className="bg-red-100 text-red-800 px-3 py-1.5 rounded text-sm font-medium text-center hover:bg-red-200 w-16"
                      >
                        {matchMarket.england.red.toFixed(2)}
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-base text-gray-700 font-semibold w-24">{awayTeam}</span>
                      <button
                        onClick={() => {}}
                        className="bg-green-100 text-green-800 px-3 py-1.5 rounded text-sm font-medium text-center hover:bg-green-200 w-16"
                      >
                        {matchMarket.india.green.toFixed(2)}
                      </button>
                      <button
                        onClick={() => {}}
                        className="bg-red-100 text-red-800 px-3 py-1.5 rounded text-sm font-medium text-center hover:bg-red-200 w-16"
                      >
                        {matchMarket.india.red.toFixed(2)}
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-xs text-gray-600">Adjust (+/- 0.01)</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            const newAdjust = Math.max(matchMarket.adjust - 0.01, 0);
                            setMatchMarket(prev => ({
                              ...prev,
                              adjust: newAdjust,
                              england: {
                                ...prev.england,
                                green: Math.max(prev.england.green - 0.01, 0),
                                red: Math.min(prev.england.red + 0.01, 10)
                              },
                              india: {
                                ...prev.india,
                                green: Math.max(prev.india.green - 0.01, 0),
                                red: Math.min(prev.india.red + 0.01, 10)
                              }
                            }));
                          }}
                          className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-50"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        <input
                          type="number"
                          step="0.01"
                          value={matchMarket.adjust}
                          onChange={(e) => {
                            const newAdjust = parseFloat(e.target.value) || 0;
                            const adjustDiff = newAdjust - matchMarket.adjust;
                            setMatchMarket(prev => ({
                              ...prev,
                              adjust: newAdjust,
                              england: {
                                ...prev.england,
                                green: Math.max(prev.england.green + adjustDiff, 0),
                                red: Math.max(prev.england.red - adjustDiff, 0)
                              },
                              india: {
                                ...prev.india,
                                green: Math.max(prev.india.green + adjustDiff, 0),
                                red: Math.max(prev.india.red - adjustDiff, 0)
                              }
                            }));
                          }}
                          className="w-16 px-2 py-1 border border-gray-300 rounded text-sm text-center"
                        />
                        <button
                          onClick={() => {
                            const newAdjust = Math.min(matchMarket.adjust + 0.01, 1.0);
                            setMatchMarket(prev => ({
                              ...prev,
                              adjust: newAdjust,
                              england: {
                                ...prev.england,
                                green: Math.min(prev.england.green + 0.01, 10),
                                red: Math.max(prev.england.red - 0.01, 0)
                              },
                              india: {
                                ...prev.india,
                                green: Math.min(prev.india.green + 0.01, 10),
                                red: Math.max(prev.india.red - 0.01, 0)
                              }
                            }));
                          }}
                          className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-50"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="border border-gray-200 rounded-lg overflow-hidden max-w-xs">
                    <table className="w-full text-xs">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-1.5 py-1 text-left font-medium text-gray-700 text-xs"></th>
                          <th className="px-1.5 py-1 text-left font-medium text-gray-700 text-xs">365</th>
                          <th className="px-1.5 py-1 text-left font-medium text-gray-700 text-xs">Indibet</th>
                          <th className="px-1.5 py-1 text-left font-medium text-gray-700 text-xs">Exchange</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white">
                        <tr>
                          <td className="px-1.5 py-1 text-gray-700 text-xs">{homeTeam}</td>
                          <td className="px-1.5 py-1">
                            <input
                              type="number"
                              step="0.1"
                              value={matchMarket.england.bet365}
                              onChange={(e) => setMatchMarket(prev => ({
                                ...prev,
                                england: { ...prev.england, bet365: parseFloat(e.target.value) || 0 }
                              }))}
                              className="w-full px-1 py-0.5 border border-gray-300 rounded text-xs text-center"
                            />
                          </td>
                          <td className="px-1.5 py-1">
                            <input
                              type="number"
                              step="0.1"
                              value={matchMarket.england.indibet}
                              onChange={(e) => setMatchMarket(prev => ({
                                ...prev,
                                england: { ...prev.england, indibet: parseFloat(e.target.value) || 0 }
                              }))}
                              className="w-full px-1 py-0.5 border border-gray-300 rounded text-xs text-center"
                            />
                          </td>
                          <td className="px-1.5 py-1">
                            <input
                              type="number"
                              step="0.1"
                              value={matchMarket.england.exchange}
                              onChange={(e) => setMatchMarket(prev => ({
                                ...prev,
                                england: { ...prev.england, exchange: parseFloat(e.target.value) || 0 }
                              }))}
                              className="w-full px-1 py-0.5 border border-gray-300 rounded text-xs text-center"
                            />
                          </td>
                        </tr>
                        <tr>
                          <td className="px-1.5 py-1 text-gray-700 text-xs">{awayTeam}</td>
                          <td className="px-1.5 py-1">
                            <input
                              type="number"
                              step="0.1"
                              value={matchMarket.india.bet365}
                              onChange={(e) => setMatchMarket(prev => ({
                                ...prev,
                                india: { ...prev.india, bet365: parseFloat(e.target.value) || 0 }
                              }))}
                              className="w-full px-1 py-0.5 border border-gray-300 rounded text-xs text-center"
                            />
                          </td>
                          <td className="px-1.5 py-1">
                            <input
                              type="number"
                              step="0.1"
                              value={matchMarket.india.indibet}
                              onChange={(e) => setMatchMarket(prev => ({
                                ...prev,
                                india: { ...prev.india, indibet: parseFloat(e.target.value) || 0 }
                              }))}
                              className="w-full px-1 py-0.5 border border-gray-300 rounded text-xs text-center"
                            />
                          </td>
                          <td className="px-1.5 py-1">
                            <input
                              type="number"
                              step="0.1"
                              value={matchMarket.india.exchange}
                              onChange={(e) => setMatchMarket(prev => ({
                                ...prev,
                                india: { ...prev.india, exchange: parseFloat(e.target.value) || 0 }
                              }))}
                              className="w-full px-1 py-0.5 border border-gray-300 rounded text-xs text-center"
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="w-full mx-auto px-6 py-6">
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="bg-blue-100 border-l-4 border-blue-600 px-4 py-2 mb-6 rounded shadow-sm">
              <div className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <h2 className="text-xl font-semibold text-blue-900">BATTERS</h2>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              {renderPlayerTable(homeTeamStartingXI, homeTeamSubs, homeTeam, homeTeam)}
              {renderPlayerTable(awayTeamStartingXI, awayTeamSubs, awayTeam, awayTeam)}
            </div>
          </div>

          {/* Bowlers Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="bg-blue-100 border-l-4 border-blue-600 px-4 py-2 mb-6 rounded shadow-sm">
              <div className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <h2 className="text-xl font-semibold text-blue-900">BOWLERS</h2>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              {renderBowlerTable(homeTeamBowlerStarting, homeTeamBowlerSubs, homeTeam, homeTeam)}
              {renderBowlerTable(awayTeamBowlerStarting, awayTeamBowlerSubs, awayTeam, awayTeam)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MatchDetails() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
      <MatchDetailsContent />
    </Suspense>
  );
}


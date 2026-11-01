import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export function useLiveRefresh(tables: string[], onChange: () => void) {
  const tablesKey = tables.join(',');

  useEffect(() => {
    const channelName = `live-${tablesKey}-${crypto.randomUUID()}`;
    let channel = supabase.channel(channelName);
    for (const table of tablesKey.split(',')) {
      channel = channel.on('postgres_changes', { event: '*', schema: 'public', table }, () => onChange());
    }
    channel.subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [tablesKey, onChange]);
}

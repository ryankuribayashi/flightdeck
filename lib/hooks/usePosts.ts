import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../supabase';
import { POSTS, type Post } from '../../constants/mockData';

type SupabasePost = {
  id: string;
  image_url: string;
  caption: string | null;
  aircraft_type: string | null;
  icao_type: string | null;
  airline: string | null;
  flight_number: string | null;
  origin_airport: string | null;
  destination_airport: string | null;
  altitude: string | null;
  speed: string | null;
  airport: string | null;
  is_live: boolean;
  is_instant: boolean;
  likes_count: number;
  created_at: string;
  profiles: {
    callsign: string;
    display_name: string | null;
    avatar_url: string | null;
  } | null;
};

function toPost(p: SupabasePost): Post {
  const created = new Date(p.created_at);
  const now = new Date();
  const diffMin = Math.floor((now.getTime() - created.getTime()) / 60000);
  const timeAgo = diffMin < 60 ? `${diffMin}m ago` : `${Math.floor(diffMin / 60)}h ago`;

  return {
    id: p.id,
    username: p.profiles?.callsign?.toLowerCase().replace(/[^a-z0-9]/g, '_') ?? 'pilot',
    callsign: p.profiles?.callsign ?? 'UNKNOWN',
    avatar: p.profiles?.avatar_url ?? `https://i.pravatar.cc/100?u=${p.id}`,
    airport: p.airport ?? 'ZZZZ',
    timeAgo,
    image: p.image_url,
    aircraft: p.aircraft_type ?? '',
    icaoType: p.icao_type ?? '',
    airline: p.airline ?? '',
    flightNum: p.flight_number ?? '',
    origin: p.origin_airport ?? '???',
    destination: p.destination_airport ?? '???',
    altitude: p.altitude ?? '---',
    speed: p.speed ?? '---',
    likes: p.likes_count,
    comments: 0,
    isLive: p.is_live,
    isInstant: p.is_instant,
    caption: p.caption ?? '',
  };
}

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>(POSTS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    if (!isSupabaseConfigured) return;

    setLoading(true);
    const { data, error } = await supabase
      .from('posts')
      .select('*, profiles(callsign, display_name, avatar_url)')
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      setError(error.message);
    } else if (data && data.length > 0) {
      setPosts((data as unknown as SupabasePost[]).map(toPost));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPosts();

    if (!isSupabaseConfigured) return;

    // Real-time subscription for new posts
    const channel = supabase
      .channel('posts-feed')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'posts' }, () => {
        fetchPosts();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [fetchPosts]);

  const createPost = async (post: Omit<Post, 'id' | 'username' | 'callsign' | 'avatar' | 'timeAgo' | 'likes' | 'comments'>, userId: string) => {
    if (!isSupabaseConfigured) return null;

    const { data, error } = await (supabase.from('posts') as any).insert({
      user_id: userId,
      image_url: post.image,
      caption: post.caption,
      aircraft_type: post.aircraft,
      icao_type: post.icaoType,
      airline: post.airline,
      flight_number: post.flightNum,
      origin_airport: post.origin,
      destination_airport: post.destination,
      altitude: post.altitude,
      speed: post.speed,
      airport: post.airport,
      is_live: post.isLive,
      is_instant: post.isInstant,
    }).select().single();

    return error ? null : data;
  };

  const toggleLike = async (postId: string, userId: string, liked: boolean) => {
    if (!isSupabaseConfigured) return;

    if (liked) {
      await (supabase.from('likes') as any).delete().match({ post_id: postId, user_id: userId });
    } else {
      await (supabase.from('likes') as any).insert({ post_id: postId, user_id: userId });
    }
  };

  return { posts, loading, error, refresh: fetchPosts, createPost, toggleLike };
}

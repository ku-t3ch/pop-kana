import { env } from '@/env.mjs';
import PocketBase from 'pocketbase';

const pb = new PocketBase(env.NEXT_PUBLIC_POCKETBASE_URL);

export default pb;
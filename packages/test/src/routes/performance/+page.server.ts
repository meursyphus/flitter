import type { PageServerLoad } from './$types';
import { histories } from '../../../performance-history/duration';

export const load = (async () => {
	return { histories };
}) satisfies PageServerLoad;

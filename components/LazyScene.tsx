'use client';
import dynamic from 'next/dynamic';
import Placeholder from './Placeholder';

// Three.js is loaded only in the browser, after the page is already visible.
const LazyScene = dynamic(() => import('./Scene3D'), {
  ssr: false,
  loading: () => <Placeholder kind="box" label={false} />,
});
export default LazyScene;

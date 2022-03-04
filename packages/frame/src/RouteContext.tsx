import { createContext } from 'react';
import type { RouteContextType } from './typings';

const routeContext: React.Context<RouteContextType> = createContext({});

export default routeContext;

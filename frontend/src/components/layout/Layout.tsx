import type { PropsWithChildren } from 'react'; import {Header} from './Header'; import {Sidebar} from './Sidebar';
export function Layout({children}:PropsWithChildren){return <><Header/><div className="app-shell"><Sidebar/><main>{children}</main></div></>}

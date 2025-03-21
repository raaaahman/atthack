/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as SettingsImport } from './routes/settings'
import { Route as IndexImport } from './routes/index'
import { Route as ContactsIndexImport } from './routes/contacts/index'
import { Route as ContactsContactIdImport } from './routes/contacts/$contactId'
import { Route as AiModelIdImport } from './routes/ai/$modelId'

// Create/Update Routes

const SettingsRoute = SettingsImport.update({
  id: '/settings',
  path: '/settings',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const ContactsIndexRoute = ContactsIndexImport.update({
  id: '/contacts/',
  path: '/contacts/',
  getParentRoute: () => rootRoute,
} as any)

const ContactsContactIdRoute = ContactsContactIdImport.update({
  id: '/contacts/$contactId',
  path: '/contacts/$contactId',
  getParentRoute: () => rootRoute,
} as any)

const AiModelIdRoute = AiModelIdImport.update({
  id: '/ai/$modelId',
  path: '/ai/$modelId',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/settings': {
      id: '/settings'
      path: '/settings'
      fullPath: '/settings'
      preLoaderRoute: typeof SettingsImport
      parentRoute: typeof rootRoute
    }
    '/ai/$modelId': {
      id: '/ai/$modelId'
      path: '/ai/$modelId'
      fullPath: '/ai/$modelId'
      preLoaderRoute: typeof AiModelIdImport
      parentRoute: typeof rootRoute
    }
    '/contacts/$contactId': {
      id: '/contacts/$contactId'
      path: '/contacts/$contactId'
      fullPath: '/contacts/$contactId'
      preLoaderRoute: typeof ContactsContactIdImport
      parentRoute: typeof rootRoute
    }
    '/contacts/': {
      id: '/contacts/'
      path: '/contacts'
      fullPath: '/contacts'
      preLoaderRoute: typeof ContactsIndexImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/settings': typeof SettingsRoute
  '/ai/$modelId': typeof AiModelIdRoute
  '/contacts/$contactId': typeof ContactsContactIdRoute
  '/contacts': typeof ContactsIndexRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/settings': typeof SettingsRoute
  '/ai/$modelId': typeof AiModelIdRoute
  '/contacts/$contactId': typeof ContactsContactIdRoute
  '/contacts': typeof ContactsIndexRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/settings': typeof SettingsRoute
  '/ai/$modelId': typeof AiModelIdRoute
  '/contacts/$contactId': typeof ContactsContactIdRoute
  '/contacts/': typeof ContactsIndexRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | '/settings'
    | '/ai/$modelId'
    | '/contacts/$contactId'
    | '/contacts'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '/settings' | '/ai/$modelId' | '/contacts/$contactId' | '/contacts'
  id:
    | '__root__'
    | '/'
    | '/settings'
    | '/ai/$modelId'
    | '/contacts/$contactId'
    | '/contacts/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  SettingsRoute: typeof SettingsRoute
  AiModelIdRoute: typeof AiModelIdRoute
  ContactsContactIdRoute: typeof ContactsContactIdRoute
  ContactsIndexRoute: typeof ContactsIndexRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  SettingsRoute: SettingsRoute,
  AiModelIdRoute: AiModelIdRoute,
  ContactsContactIdRoute: ContactsContactIdRoute,
  ContactsIndexRoute: ContactsIndexRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/settings",
        "/ai/$modelId",
        "/contacts/$contactId",
        "/contacts/"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/settings": {
      "filePath": "settings.tsx"
    },
    "/ai/$modelId": {
      "filePath": "ai/$modelId.tsx"
    },
    "/contacts/$contactId": {
      "filePath": "contacts/$contactId.tsx"
    },
    "/contacts/": {
      "filePath": "contacts/index.tsx"
    }
  }
}
ROUTE_MANIFEST_END */

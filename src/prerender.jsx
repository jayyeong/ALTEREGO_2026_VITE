import React from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import App, { loadPublicPages } from './App';

const pages = loadPublicPages();

export async function render(url) {
  return renderToString(
    <App pages={await pages} Router={MemoryRouter} routerProps={{ initialEntries: [url] }} />,
  );
}

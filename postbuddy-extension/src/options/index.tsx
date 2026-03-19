// src/options/index.tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import Options from './Options';

const root = document.createElement('div');
root.id = 'root';
document.body.appendChild(root);

createRoot(root).render(<Options />);
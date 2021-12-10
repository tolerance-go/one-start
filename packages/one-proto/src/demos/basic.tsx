/**
 * inline: true
 * compact: true
 */
import OSProto from '@ty-one-start/one-proto';
import React from 'react';

export default () => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 999,
      }}
    >
      <OSProto />
    </div>
  );
};

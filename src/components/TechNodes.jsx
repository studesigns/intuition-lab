import { useCallback, useEffect, useRef } from 'react';
import { Particles } from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';

export default function TechNodes() {
  const particlesInitialized = useRef(false);
  const mouseListenerAdded = useRef(false);

  const particlesInit = useCallback(async (engine) => {
    if (particlesInitialized.current) {
      console.log('TechNodes: Already initialized, skipping');
      return;
    }
    console.log('TechNodes: Initializing...');
    await loadSlim(engine);
    console.log('TechNodes: Loaded');
    particlesInitialized.current = true;
  }, []);

  const particlesLoaded = useCallback(async (container) => {
    console.log('TechNodes: Ready', container);

    // Add mouse tracking only once to avoid duplicate listeners
    if (mouseListenerAdded.current) {
      console.log('TechNodes: Mouse listener already added, skipping');
      return;
    }

    const handleMouseMove = (e) => {
      const target = e.target;
      const isOverInteractive = target.tagName === 'BUTTON' ||
                               target.tagName === 'INPUT' ||
                               target.tagName === 'A' ||
                               target.closest('button') ||
                               target.closest('input') ||
                               target.closest('a') ||
                               target.closest('.tool-card');

      // Update interactivity settings
      if (container.options && container.options.interactivity) {
        if (isOverInteractive) {
          // Disable hover effect when over interactive elements
          container.options.interactivity.events.onHover.enable = false;
        } else {
          // Enable hover effect when not over interactive elements
          container.options.interactivity.events.onHover.enable = true;
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    mouseListenerAdded.current = true;

    // Cleanup function
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      mouseListenerAdded.current = false;
    };
  }, []);

  const particlesOptions = {
    id: 'tsparticles',
    fullScreen: {
      enable: false,
    },
    background: {
      color: {
        value: 'transparent',
      },
    },
    fpsLimit: 60,
    particles: {
      color: {
        value: '#22d3ee',
      },
      links: {
        color: '#22d3ee',
        distance: 150,
        enable: true,
        opacity: 0.15,
        width: 1,
      },
      move: {
        enable: true,
        speed: 1,
        direction: 'none',
        random: true,
        straight: false,
        outModes: {
          default: 'bounce',
        },
      },
      number: {
        value: 50,
      },
      opacity: {
        value: 0.4,
      },
      shape: {
        type: 'circle',
      },
      size: {
        value: 3,
      },
    },
    interactivity: {
      detect_on: 'canvas',
      events: {
        onHover: {
          enable: true,
          mode: 'grab',
        },
      },
      modes: {
        grab: {
          distance: 200,
          links: {
            opacity: 1,
          },
        },
      },
    },
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    >
      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={particlesOptions}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}

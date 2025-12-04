import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, ShieldAlert, Film } from 'lucide-react';
import TechNodes from '../components/TechNodes';
import '../styles/Dashboard.css';
import '../styles/AuroraBackground.css';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: 'easeOut' },
  },
};

export default function Dashboard() {
  const navigate = useNavigate();

  // Add interactive mouse tracking to Aurora orbs
  useEffect(() => {
    const handleMouseMove = (e) => {
      const auroraContainer = document.querySelector('.aurora-container');
      if (!auroraContainer) return;

      // Check if hovering over interactive element
      const target = e.target;
      const isOverInteractive = target.tagName === 'BUTTON' ||
                               target.tagName === 'INPUT' ||
                               target.tagName === 'A' ||
                               target.closest('button') ||
                               target.closest('input') ||
                               target.closest('a');

      if (isOverInteractive) {
        // Don't apply effect when over interactive elements
        auroraContainer.style.transform = 'translate(0, 0)';
        return;
      }

      // Calculate mouse position (0-1 normalized)
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;

      // Apply subtle parallax effect to orbs
      const offsetX = (x - 50) * 0.05;
      const offsetY = (y - 50) * 0.05;

      auroraContainer.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
      auroraContainer.style.transition = 'transform 0.3s ease-out';
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      <div className="aurora-container">
        <div className="aurora-orb-3"></div>
      </div>

      <TechNodes />

      <AnimatePresence>
        <div className="dashboard-container">
          <motion.div
            className="dashboard-header"
            initial="hidden"
            animate="visible"
            variants={headerVariants}
          >
            <h1>Intuition Innovation Lab</h1>
            <p>Enterprise Portal for Internal Tools</p>
          </motion.div>

          <motion.div
            className="tools-grid"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div
              className="tool-card vo-player"
              onClick={() => navigate('/vo-player')}
              variants={cardVariants}
              whileHover={{
                scale: 1.02,
                y: -10,
              }}
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 30,
              }}
            >
              <div className="card-icon">
                <Zap size={48} />
              </div>
              <h2>VO Player</h2>
              <p>Manage and play voice-over content with advanced controls</p>
              <div className="card-action">Explore →</div>
            </motion.div>

            <motion.div
              className="tool-card compliance"
              onClick={() => navigate('/compliance')}
              variants={cardVariants}
              whileHover={{
                scale: 1.02,
                y: -10,
              }}
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 30,
              }}
            >
              <div className="card-icon">
                <ShieldAlert size={48} />
              </div>
              <h2>Compliance Risk Engine</h2>
              <p>Analyze and mitigate compliance risks across your organization</p>
              <div className="card-action">Explore →</div>
            </motion.div>

            <motion.div
              className="tool-card visual-vault"
              onClick={() => navigate('/visual-vault')}
              variants={cardVariants}
              whileHover={{
                scale: 1.02,
                y: -10,
              }}
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 30,
              }}
            >
              <div className="card-icon">
                <Film size={48} />
              </div>
              <h2>Visual Vault</h2>
              <p>Netflix-style portfolio gallery showcasing client work and projects</p>
              <div className="card-action">Explore →</div>
            </motion.div>
          </motion.div>
        </div>
      </AnimatePresence>
    </>
  );
}

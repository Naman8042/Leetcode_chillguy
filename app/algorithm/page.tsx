// "use client"
// import React from 'react';
// import { motion } from 'framer-motion';

// // Define the animation configurations
// const animationConfig = {
//   counting: {
//     initial: { opacity: 0 },
//     animate: { opacity: 1, scale: [1, 1.5, 1], color: ["#000", "#f00", "#000"] },
//     transition: { duration: 0.6 },
//   },
//   iteration: {
//     initial: { opacity: 0 },
//     animate: { opacity: 1, x: [-100, 0], backgroundColor: ["#fff", "#ff0"] },
//     transition: { duration: 0.6 },
//   },
//   swap: {
//     initial: { opacity: 0 },
//     animate: { opacity: 1, x: [0, 50, 0], y: [0, -10, 0] },
//     transition: { duration: 0.6 },
//   },
//   default: {
//     initial: { opacity: 0 },
//     animate: { opacity: 1 },
//     transition: { duration: 0.6 },
//   },
// };

// // Step interface
// interface Step {
//   type: 'counting' | 'iteration' | 'swap' | 'default';
//   description: string;
// }

// const step = [
//     { type: "counting", description: "Initialize `count` to 0." },
//     { type: "iteration", description: "Iterate through each string in the list." },
//     { type: "swap", description: "Swap the elements if necessary." },
//     { type: "counting", description: "Increment the `count` if condition matches." },
//     { type: "iteration", description: "Continue iteration to the next item." },
//   ];
  
// // Component to render a single step with animation
// const AnimatedStep: React.FC<{ step: Step }> = () => {
//   const config = animationConfig[step.type] || animationConfig.default;

//   return (
//     <motion.div
//       initial={config.initial}
//       animate={config.animate}
//       transition={config.transition}
//       style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc' }}
//     >
//       <p>{step.description}</p>
//     </motion.div>
//   );
// };

// // Example steps
// const steps: Step[] = [
//   { type: 'counting', description: 'Initialize a counter variable.' },
//   { type: 'iteration', description: 'Iterate through the list.' },
//   { type: 'swap', description: 'Swap the elements at index 1 and 2.' },
//   { type: 'default', description: 'End of the process.' },
// ];

// // Main component to display all steps
// const StepByStepGuide: React.FC = () => {
//   return (
//     <div>
//       {steps.map((step, index) => (
//         <AnimatedStep key={index} step={step} />
//       ))}
//     </div>
//   );
// };

// export default StepByStepGuide;



const page = () => {
  return (
    <div>page</div>
  )
}

export default page
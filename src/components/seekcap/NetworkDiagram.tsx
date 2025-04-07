
import React from 'react';

const NetworkDiagram = () => {
  return (
    <div className="bg-[#f3f3f3] p-8 rounded-xl">
      <h2 className="text-2xl font-bold mb-6">Network Diagram</h2>
      <img 
        src="/public/lovable-uploads/1428d007-5f52-4f4a-bd6a-d65352b9db3d.png" 
        alt="Network Diagram" 
        className="mx-auto rounded-lg shadow-md max-w-full lg:max-w-[700px]"
      />
      <p className="text-center text-sm text-muted-foreground mt-3">
        SEEKCAP network visibility solution in action
      </p>
    </div>
  );
};

export default NetworkDiagram;

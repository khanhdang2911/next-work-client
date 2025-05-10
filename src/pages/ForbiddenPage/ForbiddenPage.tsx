import { Lock } from 'lucide-react'; 
import { useState } from 'react'; 

export default function ForbiddenPage() { 
  const [hover, setHover] = useState(false); 
  
  return ( 
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-4"> 
      <div 
        className="relative transition-transform duration-300" 
        style={{ transform: hover ? 'translateY(-10px)' : 'none' }} 
        onMouseEnter={() => setHover(true)} 
        onMouseLeave={() => setHover(false)} 
      > 
        <div className="relative w-full" style={{ width: "768px", height: "768px" }}>
          <div className="absolute inset-0 flex items-center justify-center -z-10">
            <Lock className="text-black mx-auto" size={800} strokeWidth={1} />
          </div>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10" 
               style={{ paddingTop: "240px" }}>
            <h1 
              className="text-blue-800 font-bold tracking-tighter" 
              style={{ fontSize: "14rem", lineHeight: "1" }}
            > 
              403 
            </h1> 
            <p className="text-blue-600 text-4xl font-semibold tracking-wider mt-4"> 
              ACCESS FORBIDDEN 
            </p> 
          </div>
        </div>
      </div> 
    </div> 
  ); 
}

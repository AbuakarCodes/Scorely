"use client"

export default function PageLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      
      <style jsx>{`
        @keyframes rotateBall {
          0% { transform: rotateY(0deg) rotateX(0deg) rotateZ(0deg); }
          50% { transform: rotateY(360deg) rotateX(360deg) rotateZ(0deg); }
          100% { transform: rotateY(720deg) rotateX(720deg) rotateZ(360deg); }
        }

        @keyframes bounceBall {
          0% { transform: translateY(-70px) scale(1,1); }
          15% { transform: translateY(-56px) scale(1,1); }
          45% { transform: translateY(70px) scale(1,1); }
          50% { transform: translateY(73.5px) scale(1,0.92); }
          55% { transform: translateY(70px) scale(1,0.95); }
          85% { transform: translateY(-56px) scale(1,1); }
          95% { transform: translateY(-70px) scale(1,1); }
          100% { transform: translateY(-70px) scale(1,1); }
        }

        @keyframes bounceShadow {
          0% {
            filter: blur(3px);
            opacity: 0.6;
            transform: translateY(73px) scale(0.5,0.5);
          }
          45%,55% {
            filter: blur(1px);
            opacity: 0.9;
            transform: translateY(73px) scale(1,1);
          }
          100% {
            filter: blur(3px);
            opacity: 0.6;
            transform: translateY(73px) scale(0.5,0.5);
          }
        }

        .ball {
          animation: bounceBall 1.2s infinite cubic-bezier(0.42,0,0.58,1);
          border-radius: 9999px;
          height: 60px;
          width: 60px;
          position: relative;
          transform-style: preserve-3d;
          transform: translateY(-70px);
          z-index: 1;
       
        }

        .ball::before {
          content: "";
          position: absolute;
          left: -6px;
          top: -3px;
          width: calc(100% + 6px);
          height: calc(100% + 6px);
          border-radius: 9999px;
          border: 2px solid #333;
          background: radial-gradient(circle at 36px 20px,#1B4B3D);
          transform: translateZ(1vmin);
        }

        .inner {
          animation: rotateBall 25s linear infinite;
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 9999px;
          transform-style: preserve-3d;
        }

        .line::before,
        .line::after {
          content: "";
          position: absolute;
          width: 99%;
          height: 99%;
          border-radius: 9999px;
          border: 2px solid #333;
        }

        .line::after {
          transform: rotate3d(1,0,0,90deg);
        }

        .line--two::before { transform: rotate3d(0,0,0,2deg); }
        .line--two::after { transform: rotate3d(1,0,0,88deg); }

        .oval::before,
        .oval::after {
          content: "";
          position: absolute;
          width: 99%;
          height: 99%;
          border-radius: 9999px;
          border-top: 4px solid #333;
        }

        .oval::before {
          transform: rotate3d(1,0,0,45deg) translate3d(0,0,6px);
        }

        .oval::after {
          transform: rotate3d(1,0,0,-45deg) translate3d(0,0,-6px);
        }

        .oval--two::before {
          transform: rotate3d(1,0,0,135deg) translate3d(0,0,-6px);
        }

        .oval--two::after {
          transform: rotate3d(1,0,0,-135deg) translate3d(0,0,6px);
        }

        .shadow {
          animation: bounceShadow 1.2s infinite cubic-bezier(0.42,0,0.58,1);
          background: black;
          filter: blur(2px);
          border-radius: 9999px;
          height: 6px;
          width: 54px;
          transform: translateY(73px);
        }
      `}</style>

      <div className="flex flex-col items-center">
        <div className="ball">
          <div className="inner">
            <div className="line"></div>
            <div className="line line--two"></div>
            <div className="oval"></div>
            <div className="oval oval--two"></div>
          </div>
        </div>
        <div className="shadow"></div>
      </div>
    </div>
  )
}
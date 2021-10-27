import styled, { keyframes } from "styled-components";

const Loading = ({ size, margin, background, duration, dots }) => {
  const BounceAnimation = keyframes`
    0% { margin-bottom: 0; }
    100% { margin-bottom: 0 }
    to {
      opacity: 0.3;
      transform: translate3d(0, -1.5rem, 0);
    }
  `;

  const UnhideAnimation = keyframes`
    from {
      opacity: 0;
    }
    to {
      opacity: 0.0;
      transform: translate3d(0, -1.5rem, 0);
    }`;

  const DotWrapper = styled.div`
    justify-content: center;
    display: flex;
    align-items: flex-end;
  `;

  const Dot = styled.div`
    background-color: rgba(0, 01, 255, 0.61);
    border-radius: 50%;
    width: 12px;
    height: 12px;
    margin: -20px 5px;
    /* Animation */
    animation: ${BounceAnimation} 0.8s alternate infinite,
      ${UnhideAnimation} 0.8s linear;
    animation-delay: ${(props) => props.delay};
  `;

  return (
    <DotWrapper>
      &nbsp;
      <Dot delay="-.3s" />
      <Dot delay="-.6s" />
      <Dot delay=".0s" />
      &nbsp;
    </DotWrapper>
  );
};

export default Loading;

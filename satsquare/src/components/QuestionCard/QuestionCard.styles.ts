import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
 

  .number {
    font-size: 1.1rem;
  }

  .question {
    font-weight: bold;
  }
`;

type ButtonProps = {
  correct: boolean;
  userClicked: boolean;
};

export const ButtonWrapper = styled.div<ButtonProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  transition: all 0.3s ease;

  :hover {
    opacity: 0.8;
  }

  button {
    cursor: pointer;
    user-select: none;
    background: ${({ correct, userClicked }) => correct ? "#3dcda1" : !correct && userClicked ? "#d45858" : null};
    color: ${({ correct, userClicked }) => correct ? "white" : !correct && userClicked ? "white" : null};
    margin-bottom: 5px;
    border-radius: 5px;
    font-size: 1em;
    border: none;
  }
`;

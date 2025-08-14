
import styled from 'styled-components';

export const PositionFilterContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

export const PositionButton = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid ${props => props.active ? '#3b82f6' : 'rgba(255, 255, 255, 0.2)'};
  border-radius: 8px;
  background: ${props => props.active ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.active ? '#3b82f6' : 'rgba(255, 255, 255, 0.8)'};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.875rem;
  backdrop-filter: blur(10px);
  
  &:hover {
    background: rgba(59, 130, 246, 0.2);
    color: #3b82f6;
    border-color: #3b82f6;
  }
`;

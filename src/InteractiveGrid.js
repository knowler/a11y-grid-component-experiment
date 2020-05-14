import React from 'react';
import {chunk} from 'lodash-es';

import './InteractiveGrid.css';

function gridReducer(state, action) {
  const moveTo = (row, column) => {
    const coords = state.grid[row] && state.grid[row][column];

    if (coords) {
      coords.ref.current.focus();
      return {
        ...state,
        lastAction: action,
      };
    } else {
      console.log('doesn’t exist', row, column);
    }

    return state;
  };

  const select = (row, column) => {
    const coords = state.grid[row] && state.grid[row][column];

    if (coords) {
      return {
        ...state,
        row,
        column,
        lastAction: action,
      };
    } else {
      console.log('doesn’t exist', row, column);
    }

    return state;
  };

  switch (action.type) {
    case 'SELECT': {
      return select(action.payload.row, action.payload.column);
    }
    case 'MOVE_LEFT': {
      return moveTo(action.payload.row, action.payload.column - 1);
    }
    case 'MOVE_RIGHT': {
      return moveTo(action.payload.row, action.payload.column + 1);
    }
    case 'MOVE_UP': {
      return moveTo(action.payload.row - 1, action.payload.column);
    }
    case 'MOVE_DOWN': {
      return moveTo(action.payload.row + 1, action.payload.column);
    }
    case 'MOVE_TO_START_OF_ROW': {
      return moveTo(action.payload.row, 0);
    }
    case 'MOVE_TO_END_OF_ROW': {
      return moveTo(action.payload.row, state.grid[action.payload.row].length - 1);
    }
    case 'MOVE_TO_START_OF_GRID': {
      return moveTo(0, 0);
    }
    case 'MOVE_TO_END_OF_GRID': {
      const lastRowIndex = state.grid.length - 1;
      const lastRow = state.grid[lastRowIndex];

      return moveTo(lastRowIndex, lastRow.length - 1);
    }
    case 'UPDATE_GRID': {
      return {
        grid: action.payload,
        row: 0,
        column: 0,
      };
    }
    default: {
      return state;
    }
  }
}

const init = state => state;

function InteractiveGrid({columns = 1, data}) {
  const grid = React.useMemo(
    () =>
      chunk(
        data.map(value => ({value, ref: React.createRef()})),
        columns,
      ),
    [data, columns],
  );
  const [context, dispatch] = React.useReducer(
    gridReducer,
    {
      grid,
      row: 0,
      column: 0,
    },
    init,
  );

  React.useEffect(() => {
    dispatch({type: 'UPDATE_GRID', payload: grid});
  }, [grid]);

  const handleClick = event => {
    dispatch({
      type: 'SELECT',
      payload: {row: Number(event.target.dataset.row), column: Number(event.target.dataset.column)},
    });
  };

  const handleGridFocus = event => {
    dispatch({
      type: 'MOVE_TO_START_OF_GRID',
    });
  };

  const handleKeyUp = event => {
    switch (event.keyCode) {
      case 13: {
        dispatch({
          type: 'SELECT',
          payload: {
            row: Number(event.target.dataset.row),
            column: Number(event.target.dataset.column),
          },
        });
        break;
      }
      case 35: {
        if (event.ctrlKey) {
          dispatch({type: 'MOVE_TO_END_OF_GRID'});
        } else {
          dispatch({
            type: 'MOVE_TO_END_OF_ROW',
            payload: {
              row: Number(event.target.dataset.row),
              column: Number(event.target.dataset.column),
            },
          });
        }
        break;
      }
      case 36: {
        if (event.ctrlKey) {
          dispatch({type: 'MOVE_TO_START_OF_GRID'});
        } else {
          dispatch({
            type: 'MOVE_TO_START_OF_ROW',
            payload: {
              row: Number(event.target.dataset.row),
              column: Number(event.target.dataset.column),
            },
          });
        }
        break;
      }
      case 37: {
        dispatch({
          type: 'MOVE_LEFT',
          payload: {
            row: Number(event.target.dataset.row),
            column: Number(event.target.dataset.column),
          },
        });
        break;
      }
      case 38: {
        dispatch({
          type: 'MOVE_UP',
          payload: {
            row: Number(event.target.dataset.row),
            column: Number(event.target.dataset.column),
          },
        });
        break;
      }
      case 39: {
        dispatch({
          type: 'MOVE_RIGHT',
          payload: {
            row: Number(event.target.dataset.row),
            column: Number(event.target.dataset.column),
          },
        });
        break;
      }
      case 40: {
        dispatch({
          type: 'MOVE_DOWN',
          payload: {
            row: Number(event.target.dataset.row),
            column: Number(event.target.dataset.column),
          },
        });
        break;
      }
      default: {
        break;
      }
    }
  };

  return (
    <>
      <div
        role="grid"
        tabIndex={0}
        onKeyUp={handleKeyUp}
        onFocus={handleGridFocus}
        style={{'--templateColumns': `repeat(${columns}, 1fr)`}}
      >
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} role="row">
            {row.map((cell, columnIndex) => (
              <div
                key={cell.value}
                ref={cell.ref}
                role="gridcell"
                tabIndex={-1}
                data-value={cell.value}
                data-row={rowIndex}
                data-column={columnIndex}
                aria-selected={cell.value === grid[context.row][context.column].value}
                onClick={handleClick}
                onFocus={e => e.stopPropagation()}
              >
                {cell.value}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div style={{whiteSpace: 'pre'}}>
        {JSON.stringify(
          {
            grid: context.grid.reduce((a, c, i) => [...a, c.map(({value}) => value)], []),
            selected: {
              row: context.row,
              column: context.row,
            },
            lastAction: context.lastAction,
          },
          null,
          2,
        )}
      </div>
    </>
  );
}

export default InteractiveGrid;

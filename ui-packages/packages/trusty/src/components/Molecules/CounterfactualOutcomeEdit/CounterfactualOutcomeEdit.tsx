import React, { useEffect, useMemo, useState } from 'react';
import {
  Checkbox,
  FormGroup,
  NumberInput,
  Switch,
  Text,
  TextContent,
  TextInput,
  TextVariants
} from '@patternfly/react-core';
import { v4 as uuid } from 'uuid';
import { CFGoal, CFGoalRole, ItemObjectUnit } from '../../../types';
import CounterfactualOutcomeUnsupported from '../../Atoms/CounterfactualOutcomeUnsupported/CounterfactualOutcomeUnsupported';
import './CounterfactualOutcomeEdit.scss';

type CounterfactualOutcomeEditProps = {
  goal: CFGoal;
  index: number;
  onUpdateGoal: (goal: CFGoal) => void;
};

const CounterfactualOutcomeEdit = (props: CounterfactualOutcomeEditProps) => {
  const { goal, index, onUpdateGoal } = props;

  if (goal.role === CFGoalRole.UNSUPPORTED) {
    return <CounterfactualOutcomeUnsupported goal={goal} />;
  }

  let valueEdit;
  switch (typeof goal.value.value) {
    case 'boolean':
      valueEdit = (
        <CounterfactualOutcomeBoolean
          goal={goal}
          index={index}
          onUpdateGoal={onUpdateGoal}
        />
      );
      break;
    case 'number':
      valueEdit = (
        <CounterfactualOutcomeNumber
          goal={goal}
          index={index}
          onUpdateGoal={onUpdateGoal}
        />
      );
      break;
    case 'string':
      valueEdit = (
        <CounterfactualOutcomeString
          goal={goal}
          index={index}
          onUpdateGoal={onUpdateGoal}
        />
      );
      break;
  }

  return (
    <>
      <FormGroup fieldId={goal.id} label={goal.name}>
        {valueEdit}
      </FormGroup>
      <Checkbox
        id={goal.id}
        className="counterfactual-outcome__floating"
        isChecked={goal.role === CFGoalRole.FLOATING}
        onChange={checked => {
          let updatedRole = CFGoalRole.FIXED;
          if (goal.value === goal.originalValue) {
            updatedRole = CFGoalRole.ORIGINAL;
          }
          if (checked) {
            updatedRole = CFGoalRole.FLOATING;
          }
          onUpdateGoal({
            ...goal,
            role: updatedRole
          });
        }}
        label={
          <TextContent>
            <Text component={TextVariants.small}>
              Automatically adjust for counterfactual.
            </Text>
          </TextContent>
        }
      />
    </>
  );
};

export default CounterfactualOutcomeEdit;

const CounterfactualOutcomeBoolean = (
  props: CounterfactualOutcomeEditProps
) => {
  const { goal, onUpdateGoal } = props;
  const [booleanValue, setBooleanValue] = useState(goal.value.value as boolean);

  useEffect(() => {
    setBooleanValue(goal.value.value as boolean);
  }, [goal.value]);

  const handleChange = (checked: boolean) => {
    if (isFloating(goal)) {
      return;
    }
    onUpdateGoal({
      ...goal,
      value: { ...(goal.value as ItemObjectUnit), value: checked }
    });
  };

  return (
    <Switch
      id={uuid()}
      label="True"
      labelOff="False"
      isChecked={booleanValue}
      isDisabled={isFloating(goal)}
      onChange={handleChange}
    />
  );
};

const CounterfactualOutcomeNumber = (props: CounterfactualOutcomeEditProps) => {
  const { goal, index, onUpdateGoal } = props;
  const [numberValue, setNumberValue] = useState<number>();

  const touchSpinWidth = useMemo(() => String(goal.value).length + 2, [
    goal.value
  ]);

  const onMinus = () => {
    if (isFloating(goal)) {
      return;
    }
    onUpdateGoal({
      ...goal,
      value: {
        ...(goal.value as ItemObjectUnit),
        value: (goal.value.value as number) - 1
      }
    });
  };

  const onChange = event => {
    if (isFloating(goal)) {
      return;
    }
    onUpdateGoal({
      ...goal,
      value: {
        ...(goal.value as ItemObjectUnit),
        value: Number(event.target.value)
      }
    });
  };

  const onPlus = () => {
    if (isFloating(goal)) {
      return;
    }
    onUpdateGoal({
      ...goal,
      value: {
        ...(goal.value as ItemObjectUnit),
        value: (goal.value.value as number) + 1
      }
    });
  };

  useEffect(() => {
    setNumberValue(goal.value.value as number);
  }, [goal.value]);

  return (
    <NumberInput
      value={numberValue}
      onMinus={onMinus}
      onChange={onChange}
      onPlus={onPlus}
      inputName={`goal-${index}-${goal.name}`}
      id={`goal-${index}-${goal.name}`}
      inputAriaLabel="`${outcome.outcomeName} input`"
      minusBtnAriaLabel="minus"
      plusBtnAriaLabel="plus"
      widthChars={touchSpinWidth}
      isDisabled={isFloating(goal)}
    />
  );
};

const CounterfactualOutcomeString = (props: CounterfactualOutcomeEditProps) => {
  const { goal, index, onUpdateGoal } = props;

  const handleChange = (value: string) => {
    if (isFloating(goal)) {
      return;
    }
    onUpdateGoal({
      ...goal,
      value: { ...(goal.value as ItemObjectUnit), value: value }
    });
  };

  return (
    <TextInput
      id={`goal-${index}-${goal.name}`}
      name={`goal-${index}-${goal.name}`}
      value={goal.value.value as string}
      onChange={handleChange}
      style={{ width: 250 }}
      isDisabled={isFloating(goal)}
    />
  );
};

const isFloating = (goal: CFGoal) => {
  return goal.role === CFGoalRole.FLOATING;
};

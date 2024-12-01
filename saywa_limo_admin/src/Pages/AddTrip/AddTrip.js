import { Box, Button, Menu, MenuItem, Step, StepButton, Stepper, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import './AddTrip.css'
import AddTripAction from './AddTripAction';

const steps = ['Select Trip', 'Payment', 'Confirmation'];


function AddTrip() {
  const [fromDate, setFromDate] = useState(new Date())
  const [toDate, setToDate] = useState(new Date())
  const boxStyle = {
    border: '1px dashed #e0e0e0',
    margin: '2px',
    padding: '10px'
  }



  // Steps
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState({});

  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? // It's the last step, but not all steps have been completed,
        // find the first step that has been completed
        steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    setActiveStep(newActiveStep);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  const handleComplete = () => {
    const newCompleted = completed;
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
    handleNext();
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
  };

  return (
    <div>

      <div>
        <AddTripAction />
      </div>

      {/* <div className='trip-container'>
        <h5><strong>Find your vehicle</strong></h5>
        <Row className='p-2'>
          <Col className='d-flex gap-2' style={boxStyle}>
            <TextField size='small' label='Source' />
            <TextField size="small" label='Destination' />
          </Col>
          <Col className='d-flex gap-2' style={boxStyle}>
            <TextField
              size="small"
              label='From Date'
              type='date'
              value={fromDate} />
            <TextField
              size="small"
              label='To Date'
              type='date'
              value={toDate} />
          </Col>
          <Col className='d-flex gap-2 align-items-center' style={boxStyle}>
            <TextField size="small" label='No of Passengers' />
            <div style={{
              background: 'rgb(10 133 25)',
              color: 'white',
              borderRadius: '20px',
              padding: '5px'
            }}>
              <LocalTaxiIcon />
            </div>
          </Col>
        </Row>
      </div>


      <div className='trip-container mt-4'>
        <h4><strong>Vehicles</strong></h4>
        <TextField size="small" label='Pickup Time' />
        <TextField size="small" label='Bags' />
        <TextField size="small" label='Driver - Yes/No' />
        <TextField size="small" label='Vehicle' />
      </div>
      <div className='trip-container mt-4'>
        <table className='w-100'>
          <th>slno</th>
          <th>slno</th>
          <tr>
            <td>1</td>
            <td>Benz</td>
            <td><Button variant='contained' size='small'>Book Now</Button></td>
          </tr>
        </table>
      </div>


      <div className='trip-container mt-4'>
        <Box sx={{ width: '100%' }}>
          <Stepper nonLinear activeStep={activeStep}>
            {steps.map((label, index) => (
              <Step key={label} completed={completed[index]}>
                <StepButton color="inherit" onClick={handleStep(index)}>
                  {label}
                </StepButton>
              </Step>
            ))}
          </Stepper>
          <div>
            {allStepsCompleted() ? (
              <React.Fragment>
                <Typography sx={{ mt: 2, mb: 1 }}>
                  All steps completed - you&apos;re finished
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                  <Box sx={{ flex: '1 1 auto' }} />
                  <Button onClick={handleReset}>Reset</Button>
                </Box>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <div>asdadasdasaaaxxxxxxxxxxxxxxx</div>
                <Typography sx={{ mt: 2, mb: 1, py: 1 }}>
                  Step {activeStep + 1}
                  asdadasd
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                  <Button
                    color="inherit"
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    sx={{ mr: 1 }}
                  >
                    Back
                  </Button>
                  <Box sx={{ flex: '1 1 auto' }} />
                  <Button onClick={handleNext} sx={{ mr: 1 }}>
                    Next
                  </Button>
                  {activeStep !== steps.length &&
                    (completed[activeStep] ? (
                      <Typography variant="caption" sx={{ display: 'inline-block' }}>
                        Step {activeStep + 1} already completed
                      </Typography>
                    ) : (
                      <Button onClick={handleComplete}>
                        {completedSteps() === totalSteps() - 1
                          ? 'Finish'
                          : 'Complete Step'}
                      </Button>
                    ))}
                </Box>
              </React.Fragment>
            )}
          </div>
        </Box>
      </div> */}
    </div >
  )
}

export default AddTrip
import React from "react";
import {Container, Row, Col} from "reactstrap";
import InfoRoundedIcon from '@material-ui/icons/InfoRounded';



export const EmptyPlaceholder = (props) => {
    return(
        <div className="empty-placeholder">
        <div className="center">
            <div className='content'>
                <Container>
                    <Row>
                        <Col><InfoRoundedIcon style={{fontSize: 200}} /></Col>
                    </Row>
                    <Row>
                        <Col><h4>{`There are no ${props.type}s to share with you at the moment.`}</h4></Col>
                    </Row>
                </Container>
            </div>
        </div>
        </div>
    )
}
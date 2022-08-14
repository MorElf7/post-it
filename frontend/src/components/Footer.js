import React from 'react';

import {Container} from 'react-bootstrap';

export default function Footer() {

    return (
        <footer className="bg-dark py-2 mt-auto">
            <Container>
                <span className="text-muted lead">PostIt</span>
            </Container>
        </footer>
    );
}

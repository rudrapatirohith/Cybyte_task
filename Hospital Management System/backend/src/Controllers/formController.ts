import { Request, Response } from 'express';
import { PoolConnection } from 'mysql2/promise';
import {
    insertFormData,
    updateFormData,
    getFormDataById,
    getAllFormData,
    deleteFormDataById
} from '../Models/formModel';
import { JwtPayload } from 'jsonwebtoken';

// Extend the Request type to include `db`
interface CustomRequest extends Request {
    db?: PoolConnection;
    user?: JwtPayload;
}

// Helper function to parse JSON data safely
const parseJSON = (data: any) => {
    try {
        if (typeof data === 'string' && (data.startsWith('{') || data.startsWith('['))) {
            return JSON.parse(data);
        }
        return data;
    } catch (e) {
        console.error('JSON Parsing Error:', e);
        return null;
    }
};

// Controller to insert data
export const insertData = (req: CustomRequest, res: Response): void => {
    const db: PoolConnection = req.db as PoolConnection;

    let {
        text_field, multi_line_text, email, telephone, number_field,
        date_field, time_field, timestamp_field, checkbox_field, dropdown_field,
        radio_list, checkbox_list, list_box
    } = req.body;

    checkbox_field = checkbox_field ? 1 : 0; // Ensuring checkbox_field is 1 or 0

    text_field = parseJSON(text_field);
    multi_line_text = parseJSON(multi_line_text);
    email = parseJSON(email);
    telephone = parseJSON(telephone);
    date_field = parseJSON(date_field);
    time_field = parseJSON(time_field);
    timestamp_field = parseJSON(timestamp_field);
    checkbox_field = parseJSON(checkbox_field);
    dropdown_field = parseJSON(dropdown_field);
    radio_list = parseJSON(radio_list);
    checkbox_list = parseJSON(checkbox_list);
    list_box = parseJSON(list_box);

    const files = req.files as Record<string, Express.Multer.File[]>;
    const pdf_file = files['pdf_file'] ? files['pdf_file'][0]?.filename || '' : '';
    const image_file = files['image_file'] ? files['image_file'][0]?.filename || '' : '';
    
    const userId = (req.user as any)?.userId;
    if (!userId) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
    }

    insertFormData(db, {
        user_id: userId,
        text_field,
        multi_line_text,
        email,
        telephone,
        number_field,
        date_field,
        time_field,
        timestamp_field,
        checkbox_field,
        dropdown_field,
        radio_list,
        checkbox_list:Array.isArray(req.body.checkbox_list) ? req.body.checkbox_list : [],
        pdf_file: pdf_file || '',
        image_file: image_file || '',
        list_box
    })
    .then(() => {
        res.status(201).json({ message: 'Data inserted successfully' });
    })
    .catch((error: Error) => {
        console.error('Insert Data Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    });
};

// Controller to update data
export const updateData = (req: CustomRequest, res: Response): void => {
    const db: PoolConnection = req.db as PoolConnection;

    let {
        text_field, multi_line_text, email, telephone, number_field,
        date_field, time_field, timestamp_field, checkbox_field, dropdown_field,
        radio_list, checkbox_list, list_box
    } = req.body;

    checkbox_field = checkbox_field ? 1 : 0; // Ensure checkbox_field is 1 or 0

    const files = req.files as Record<string, Express.Multer.File[]>;
    const pdf_file = files['pdf_file'] ? files['pdf_file'][0]?.filename || '' : '';
    const image_file = files['image_file'] ? files['image_file'][0]?.filename || '' : '';

    const userId = (req.user as any)?.userId;
    const recordId = parseInt(req.params.id, 10);

    if (!userId || !recordId) {
        res.status(401).json({ message: 'Invalid request' });
        return;
    }

    updateFormData(db, recordId, {
        text_field,
        multi_line_text,
        email,
        telephone,
        number_field,
        date_field,
        time_field,
        timestamp_field,
        checkbox_field,
        dropdown_field,
        radio_list,
        checkbox_list:Array.isArray(req.body.checkbox_list) ? req.body.checkbox_list.join(',') : req.body.checkbox_list,
        pdf_file: pdf_file || '',
        image_file: image_file || '',
        list_box,
        user_id: userId
    })
    .then(() => {
        res.status(200).json({ message: 'Data updated successfully' });
    })
    .catch((error: Error) => {
        console.error('Update Data Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    });
};

// Controller to get data by ID
export const getDataById = (req: CustomRequest, res: Response): void => {
    const db: PoolConnection = req.db as PoolConnection;

    const userId = (req.user as any)?.userId;
    const recordId = parseInt(req.params.id, 10);

    if (!userId || !recordId) {
        res.status(401).json({ message: 'Invalid request' });
        return;
    }

    getFormDataById(db, recordId, userId)
    .then((data) => {
        if (data) {

            data.checkbox_list = parseJSON(data.checkbox_list) || [];
            data.list_box = parseJSON(data.list_box) || [];

            if (data.image_file) {
                data.image_file_url = `${req.protocol}://${req.get('host')}/uploads/${data.image_file}`;
            }
            if (data.pdf_file) {
                data.pdf_file_url = `${req.protocol}://${req.get('host')}/uploads/${data.pdf_file}`;
            }
            res.status(200).json({ data });
        } else {
            res.status(404).json({ message: 'Record not found' });
        }
    })
    .catch((error: Error) => {
        console.error('Get Data Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    });
};

// Controller to get all data
export const getAllData = (req: CustomRequest, res: Response): void => {
    const db: PoolConnection = req.db as PoolConnection;

    const userId = (req.user as any)?.userId;

    if (!userId) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
    }

    getAllFormData(db, userId)
    .then((data) => {
        data.forEach(record => {

            record.checkbox_list = parseJSON(record.checkbox_list) || [];
            record.list_box = parseJSON(record.list_box) || [];

            if (record.image_file) {
                record.image_file_url = `${req.protocol}://${req.get('host')}/uploads/${record.image_file}`;
            }
            if (record.pdf_file) {
                record.pdf_file_url = `${req.protocol}://${req.get('host')}/uploads/${record.pdf_file}`;
            }
        });
        res.status(200).json({ data });
    })
    .catch((error: Error) => {
        console.error('Get All Data Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    });
};

// Controller to delete data by ID
export const deleteData = (req: CustomRequest, res: Response): void => {
    const db: PoolConnection = req.db as PoolConnection;

    const userId = (req.user as any)?.userId;
    const recordId = parseInt(req.params.id, 10);

    if (!userId || !recordId) {
        res.status(401).json({ message: 'Invalid request' });
        return;
    }

    deleteFormDataById(db, recordId, userId)
    .then(() => {
        res.status(200).json({ message: 'Data deleted successfully' });
    })
    .catch((error: Error) => {
        console.error('Delete Data Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    });
};

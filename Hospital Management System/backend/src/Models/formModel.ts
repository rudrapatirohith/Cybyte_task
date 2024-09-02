import { PoolConnection } from 'mysql2/promise';

export interface FormData {
    user_id: number;
    text_field: string;
    multi_line_text: string;
    email: string;
    telephone: string;
    number_field: number;
    date_field: string;
    time_field: string;
    timestamp_field: string;
    checkbox_field: boolean;
    dropdown_field: string;
    radio_list: string;
    checkbox_list: string[];
    pdf_file: string;
    image_file: string;
    list_box: string[];
    image_file_url?: string;
    pdf_file_url?: string;
}

export const insertFormData = async (connection: PoolConnection, data: FormData): Promise<void> => {
    const query = `
        INSERT INTO patientsInfo (
            user_id, text_field, multi_line_text, email, telephone, number_field, date_field, time_field, 
            timestamp_field, checkbox_field, dropdown_field, radio_list, checkbox_list, pdf_file, image_file, list_box
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        data.user_id, data.text_field, data.multi_line_text, data.email, data.telephone, data.number_field,
        data.date_field, data.time_field, data.timestamp_field, data.checkbox_field, data.dropdown_field,
        data.radio_list, JSON.stringify(data.checkbox_list), data.pdf_file, data.image_file,
        JSON.stringify(data.list_box)
    ];

    return connection.execute(query, values)
        .then(() => {})
        .catch(error => {
            throw error;
        });
};

export const updateFormData = async (connection: PoolConnection, id: number, data: Partial<FormData>): Promise<void> => {
    const query = `
        UPDATE patientsInfo SET
            text_field = COALESCE(?, text_field), 
            multi_line_text = COALESCE(?, multi_line_text), 
            email = COALESCE(?, email), 
            telephone = COALESCE(?, telephone), 
            number_field = COALESCE(?, number_field),
            date_field = COALESCE(?, date_field), 
            time_field = COALESCE(?, time_field), 
            timestamp_field = COALESCE(?, timestamp_field), 
            checkbox_field = COALESCE(?, checkbox_field), 
            dropdown_field = COALESCE(?, dropdown_field),
            radio_list = COALESCE(?, radio_list), 
            checkbox_list = COALESCE(?, checkbox_list), 
            pdf_file = COALESCE(?, pdf_file), 
            image_file = COALESCE(?, image_file),
            list_box = COALESCE(?, list_box)
        WHERE id = ? AND user_id = ?
    `;

    const values = [
        data.text_field || null, 
        data.multi_line_text || null, 
        data.email || null, 
        data.telephone || null, 
        data.number_field || null,
        data.date_field || null, 
        data.time_field || null, 
        data.timestamp_field || null, 
        data.checkbox_field || null, 
        data.dropdown_field || null,
        data.radio_list || null, 
        JSON.stringify(data.checkbox_list) || null, 
        data.pdf_file || null, 
        data.image_file || null,
        JSON.stringify(data.list_box) || null, 
        id, 
        data.user_id
    ];

    return connection.execute(query, values)
        .then(() => {})
        .catch(error => {
            throw error;
        });
};


export const getFormDataById = async (connection: PoolConnection, id: number, userId: number): Promise<FormData | null> => {
    const query = 'SELECT * FROM patientsInfo WHERE id = ? AND user_id = ?';

    return connection.execute(query, [id, userId])
        .then(([rows]) => {
            const [row] = rows as FormData[];
            if(row){
                row.checkbox_field = JSON.parse(row.checkbox_list as unknown as string);
                row.list_box = JSON.parse(row.list_box as unknown as string);
            }
            return row || null;
        })
        .catch(error => {
            throw error;
        });
};

export const getAllFormData = async (connection: PoolConnection, userId: number): Promise<FormData[]> => {
    const query = 'SELECT * FROM patientsInfo WHERE user_id = ?';

    return connection.execute(query, [userId])
        .then(([rows]) => rows as FormData[])
        .catch(error => {
            throw error;
        });
};

export const deleteFormDataById = async (connection: PoolConnection, id: number, userId: number): Promise<void> => {
    const query = 'DELETE FROM patientsInfo WHERE id = ? AND user_id = ?';

    return connection.execute(query, [id, userId])
        .then(() => {})
        .catch(error => {
            throw error;
        });
};

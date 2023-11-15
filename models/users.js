const usersModel = {
    getAll: `
        SELECT 
            * 
        FROM 
            simpsons_characters 
        LIMIT 
        5`,

    getByID:`
    SELECT 
        * 
    FROM 
        simpsons_characters
    WHERE 
        id= ?`, 

    addRow: `
    INSERT 
    INTO 
        simpsons_characters 
        (name, normalized_name, gender)
    VALUES (?, ?, ?)`,
              
    getByUsername: `
    SELECT 
        * 
    FROM 
        simpsons_characters 
    WHERE 
        name = ?`,


    updateRow: `
    UPDATE 
        simpsons_characters 
    SET
        name = ?,
        Normalized_name = ?,
        Gender = ?
    WHERE id =?`,

    deleteRow: `
    UPDATE 
        simpsons_characters  
    SET 
    Normalized_name = 0 
    WHERE 
        id = ?`,
};

module.exports = usersModel;
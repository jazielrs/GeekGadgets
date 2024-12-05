using System.Collections;
using System.Diagnostics;
using System.Security.AccessControl;
using core;
using core.DataBase;
using core.Models;

public class CampainBusiness
{
    CampainDb db = new CampainDb();
    public async void SaveCampain(Campain campain)
    {
        await db.GuardarMensajeAsync(campain);
    }

    public async Task<IEnumerable<Campain>> GetMessageList()
    {
        try
        {
            IEnumerable<Campain> messages = await db.GetMessages();
            return messages;
        }
        catch (Exception ex)
        {
            throw new ArgumentException("Error al obtener los mensajes", ex);
        }
    }

    public async void eraseCampain(string message)
    {
        if(message == null){
            throw new ArgumentException("Mensaje no valido");
        }
        try
        {
            await db.BorradoLogico(message);
        }
        catch (Exception ex)
        {
            throw new ArgumentException("Error al obtener los mensajes", ex);
        }
    }
}
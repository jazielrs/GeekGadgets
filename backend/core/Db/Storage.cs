namespace core.DataBase;
public class Storage
{
    public string ConnectionStringMyDb { get; private set; }

    public static Storage Instance;
    public static void Init(string connectionStringMyDb)
    {
        if (string.IsNullOrEmpty(connectionStringMyDb) || string.IsNullOrEmpty(connectionStringMyDb))
            throw new ArgumentNullException("Se necesita un string de conexion");
        Instance = new Storage( connectionStringMyDb);
    }

    private Storage(string connectionStringMyDb)
    {
        ConnectionStringMyDb = connectionStringMyDb;
    }

}
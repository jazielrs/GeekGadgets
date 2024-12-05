﻿using System;
using System.Collections.Generic;
using System.Security.Claims;
namespace core;

public class UserAccount
{
    public string UserName { get; }
    public string UserPassword { get; }
    public IEnumerable<Claim> UserRoles { get; }

    public UserAccount(string userName, string userPassword, List<Claim> userRoles)
    {
        UserName = userName;
        UserPassword = userPassword;
        UserRoles = userRoles;
    }

}